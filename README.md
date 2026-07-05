# Infinity Luxeus Perfume

Premium animated perfume launch page built with React, Vite, TypeScript, Tailwind CSS, GSAP ScrollTrigger, canvas frame sequencing, and an optional React Three Fiber atmosphere layer.

## Run Locally

```bash
npm install
npm run dev
```

Preview URL:

```text
http://127.0.0.1:5173
```

GitHub Pages URL:

```text
https://elitealvidigital-ui.github.io/3d-website/
```

Production build:

```bash
npm run build
```

GitHub Pages build:

```bash
GITHUB_PAGES=true npm run build
```

## Update Price And WhatsApp

Edit `src/App.tsx`.

- Price placeholder: `₹[ADD_PRICE_HERE]`
- WhatsApp placeholder: `https://wa.me/YOUR_WHATSAPP_NUMBER?text=I%20want%20to%20order%20Infinity%20Luxeus%20Perfume`

## Frame Assets

Optimized WebP frames used by the canvas:

```text
public/assets/infinity-luxeus/frames-webp/
```

Poster and Open Graph images:

```text
public/assets/infinity-luxeus/poster.png
public/assets/infinity-luxeus/og-image.png
```

Keep frame names sequential:

```text
frame_000001.webp
frame_000002.webp
...
frame_000240.webp
```

Keep the WebP sequence compact for GitHub Pages. Do not commit duplicate PNG
frame folders unless you are intentionally moving to a different hosting setup.

## Performance Notes

The product sequence renders on one canvas. It loads the first frame immediately, preloads 24 frames on mobile or 48 frames on larger screens, and idle-loads the remaining frames.

The React Three Fiber atmosphere is code-split and only enabled on non-mobile, non-reduced-motion viewports. Reduced-motion users receive the poster image fallback.
