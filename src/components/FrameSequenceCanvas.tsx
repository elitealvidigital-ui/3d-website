import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ASSET_ROOT = '/assets/infinity-luxeus'
const WEBP_DIR = `${ASSET_ROOT}/frames-webp`
const POSTER_SRC = `${ASSET_ROOT}/poster.png`
const FRAME_RATE = 24
const FRAME_COUNT = 240

type FrameSequenceCanvasProps = {
  scrollTargetRef: RefObject<HTMLElement | null>
}

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number },
  ) => number
  cancelIdleCallback?: (handle: number) => void
}

const clampFrame = (frame: number) => Math.min(FRAME_COUNT, Math.max(1, frame))

const frameName = (frame: number) => `frame_${String(frame).padStart(6, '0')}`

const frameSrc = (frame: number, ext: 'webp' | 'png') =>
  ext === 'webp'
    ? `${WEBP_DIR}/${frameName(frame)}.webp`
    : `${WEBP_DIR}/${frameName(frame)}.webp`

const drawCover = (
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) => {
  const imageRatio = image.naturalWidth / image.naturalHeight
  const canvasRatio = width / height
  const drawWidth = canvasRatio > imageRatio ? width : height * imageRatio
  const drawHeight = canvasRatio > imageRatio ? width / imageRatio : height
  const offsetX = (width - drawWidth) / 2
  const offsetY = (height - drawHeight) / 2

  context.clearRect(0, 0, width, height)
  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
}

export function FrameSequenceCanvas({
  scrollTargetRef,
}: FrameSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imageCacheRef = useRef<(HTMLImageElement | undefined)[]>([])
  const loadCacheRef = useRef<(Promise<HTMLImageElement> | undefined)[]>([])
  const currentFrameRef = useRef(1)
  const [loadedCount, setLoadedCount] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  const renderFrame = useCallback((requestedFrame: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const frame = clampFrame(requestedFrame)
    let image = imageCacheRef.current[frame]

    if (!image) {
      for (let offset = 1; offset < FRAME_COUNT; offset += 1) {
        image =
          imageCacheRef.current[frame - offset] ??
          imageCacheRef.current[frame + offset]
        if (image) break
      }
    }

    if (!image) return

    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.max(1, Math.round(rect.width))
    const height = Math.max(1, Math.round(rect.height))
    const targetWidth = Math.round(width * dpr)
    const targetHeight = Math.round(height * dpr)

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth
      canvas.height = targetHeight
    }

    const context = canvas.getContext('2d')
    if (!context) return

    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    drawCover(context, image, width, height)
  }, [])

  const loadFrame = useCallback(
    (requestedFrame: number) => {
      const frame = clampFrame(requestedFrame)
      const cachedImage = imageCacheRef.current[frame]
      const cachedLoad = loadCacheRef.current[frame]

      if (cachedImage) return Promise.resolve(cachedImage)
      if (cachedLoad) return cachedLoad

      const load = new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image()

        image.decoding = 'async'
        image.loading = 'eager'
        image.onload = () => {
          imageCacheRef.current[frame] = image
          setLoadedCount((count) => Math.min(FRAME_COUNT, count + 1))
          resolve(image)
        }
        image.onerror = () => reject(new Error(`Unable to load frame ${frame}`))
        image.src = frameSrc(frame, 'webp')
      })

      loadCacheRef.current[frame] = load
      return load
    },
    [],
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateReducedMotion = () => setReducedMotion(mediaQuery.matches)

    updateReducedMotion()
    mediaQuery.addEventListener('change', updateReducedMotion)

    return () => mediaQuery.removeEventListener('change', updateReducedMotion)
  }, [])

  useEffect(() => {
    if (reducedMotion) return undefined

    let cancelled = false
    const initialBatch = window.matchMedia('(max-width: 767px)').matches ? 24 : 48
    const idleWindow = window as IdleWindow
    let idleHandle = 0

    const scheduleIdle = (callback: () => void) => {
      if (idleWindow.requestIdleCallback) {
        return idleWindow.requestIdleCallback(callback, { timeout: 900 })
      }

      return window.setTimeout(callback, 90)
    }

    const cancelIdle = (handle: number) => {
      if (idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(handle)
        return
      }

      window.clearTimeout(handle)
    }

    void loadFrame(1).then(() => {
      if (cancelled) return
      currentFrameRef.current = 1
      renderFrame(1)
      setIsReady(true)
    })

    void Promise.all(
      Array.from({ length: initialBatch }, (_, index) => loadFrame(index + 1)),
    )

    let nextFrame = initialBatch + 1
    const loadRemainingFrames = () => {
      if (cancelled || nextFrame > FRAME_COUNT) return

      const chunk = Array.from({ length: 8 }, () => nextFrame++).filter(
        (frame) => frame <= FRAME_COUNT,
      )

      void Promise.all(chunk.map((frame) => loadFrame(frame))).finally(() => {
        if (!cancelled && nextFrame <= FRAME_COUNT) {
          idleHandle = scheduleIdle(loadRemainingFrames)
        }
      })
    }

    idleHandle = scheduleIdle(loadRemainingFrames)

    return () => {
      cancelled = true
      cancelIdle(idleHandle)
    }
  }, [loadFrame, reducedMotion, renderFrame])

  useEffect(() => {
    if (reducedMotion) return undefined

    const scrollTarget = scrollTargetRef.current
    if (!scrollTarget) return undefined

    const trigger = ScrollTrigger.create({
      trigger: scrollTarget,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const frame = clampFrame(
          Math.round(self.progress * (FRAME_COUNT - 1)) + 1,
        )

        if (frame === currentFrameRef.current) return
        currentFrameRef.current = frame

        window.requestAnimationFrame(() => renderFrame(frame))
        void loadFrame(frame).then(() => renderFrame(frame))
        void loadFrame(frame + 1)
        void loadFrame(frame + 2)
      },
    })

    return () => trigger.kill()
  }, [loadFrame, reducedMotion, renderFrame, scrollTargetRef])

  useEffect(() => {
    if (reducedMotion) return undefined

    const handleResize = () => renderFrame(currentFrameRef.current)
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [reducedMotion, renderFrame])

  if (reducedMotion) {
    return (
      <img
        className="frame-poster"
        src={POSTER_SRC}
        alt="Infinity Luxeus Perfume bottle surrounded by soft mist"
      />
    )
  }

  return (
    <div className="frame-canvas-shell" aria-live="polite">
      <canvas
        ref={canvasRef}
        className="frame-canvas"
        role="img"
        aria-label={`${FRAME_RATE} FPS scroll animated Infinity Luxeus Perfume bottle reveal`}
      >
        Infinity Luxeus Perfume scroll-controlled product animation.
      </canvas>
      {!isReady && (
        <div className="frame-loading">
          <span>Preparing bottle animation</span>
          <strong>{Math.min(100, Math.round((loadedCount / 48) * 100))}%</strong>
        </div>
      )}
    </div>
  )
}
