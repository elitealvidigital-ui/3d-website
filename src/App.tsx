import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Gem,
  Menu,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { FrameSequenceCanvas } from './components/FrameSequenceCanvas'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const LuxuryAtmosphere3D = lazy(() =>
  import('./components/LuxuryAtmosphere3D').then((module) => ({
    default: module.LuxuryAtmosphere3D,
  })),
)

const whatsappHref =
  'https://wa.me/YOUR_WHATSAPP_NUMBER?text=I%20want%20to%20order%20Infinity%20Luxeus%20Perfume'
const pricePlaceholder = '₹[ADD_PRICE_HERE]'

const navLinks = [
  { href: '#story', label: 'Story' },
  { href: '#notes', label: 'Notes' },
  { href: '#details', label: 'Details' },
  { href: '#order', label: 'Order' },
]

const storyChapters = [
  ['Reveal', 'A cinematic opening in gold, smoke, and glass.'],
  ['Presence', 'A refined signature made to linger with restraint.'],
  ['Scent', 'Fresh spice, florals, amber, oud, musk, and vanilla.'],
  ['Detail', 'Premium glass, amber glow, and black-gold identity.'],
  ['Aura', 'Built for nights, events, and unforgettable entries.'],
  ['Order', 'A polished private-order experience on WhatsApp.'],
]

const scentNotes = [
  { label: 'Top Notes', value: 'Bergamot · Lemon · Fresh Spice' },
  { label: 'Heart Notes', value: 'Rose · Jasmine · Lavender' },
  { label: 'Base Notes', value: 'Oud · Amber · Musk · Vanilla' },
]

const details = [
  'Amber liquid glow',
  'Premium glass finish',
  'Black-gold cap',
  'Signature Infinity identity',
  'Elegant bottle silhouette',
]

const benefits = [
  {
    icon: Clock,
    title: 'Long Lasting',
    copy: 'Designed to stay present through long evenings and meaningful moments.',
  },
  {
    icon: Gem,
    title: 'Premium Aura',
    copy: 'A refined balance of warmth, depth, and quiet confidence.',
  },
  {
    icon: Sparkles,
    title: 'Signature Scent',
    copy: 'Amber, oud, musk, and vanilla leave a memorable trail.',
  },
  {
    icon: ShieldCheck,
    title: 'Event Ready',
    copy: 'Polished enough for celebrations, meetings, and formal nights.',
  },
]

const moodLines = [
  'A fragrance that announces presence.',
  'Designed for nights, events, and unforgettable entries.',
  'Made to stay in memory.',
]

const trustBadges = [
  {
    icon: ShieldCheck,
    title: 'Private Confirmation',
    copy: 'Order details confirmed manually before dispatch.',
  },
  {
    icon: Truck,
    title: 'Delivery Placeholder',
    copy: 'Add your delivery policy before launch.',
  },
  {
    icon: CreditCard,
    title: 'Payment Placeholder',
    copy: 'Add available payment methods before launch.',
  },
]

const testimonials = [
  {
    name: 'Aarav M.',
    copy: 'Elegant without feeling loud. The amber and oud finish feels made for evenings.',
  },
  {
    name: 'Nisha R.',
    copy: 'The bottle looks premium, and the scent feels warm, polished, and memorable.',
  },
  {
    name: 'Karan S.',
    copy: 'A classy fragrance for gifting. Smooth opening, rich dry down, strong presence.',
  },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <a className="brand-mark" href="#hero" aria-label="Infinity Luxeus home">
        Infinity Luxeus
      </a>
      <nav className="desktop-nav" aria-label="Primary">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <a
          className="header-whatsapp magnetic"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          aria-label="Order Infinity Luxeus Perfume on WhatsApp"
        >
          <MessageCircle size={18} aria-hidden="true" />
          <span>WhatsApp Order</span>
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <nav
        className={`mobile-nav${menuOpen ? ' is-open' : ''}`}
        aria-label="Mobile primary"
      >
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} onClick={closeMenu}>
            {link.label}
          </a>
        ))}
        <a href={whatsappHref} target="_blank" rel="noreferrer">
          WhatsApp Order
        </a>
      </nav>
    </header>
  )
}

function CTAButtons() {
  return (
    <div className="cta-row reveal">
      <a className="luxury-button magnetic" href="#order">
        <ShoppingBag size={18} aria-hidden="true" />
        <span>Shop Now</span>
      </a>
      <a
        className="ghost-button magnetic"
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={18} aria-hidden="true" />
        <span>WhatsApp Order</span>
      </a>
    </div>
  )
}

function ParticleField() {
  return (
    <div className="particle-field" aria-hidden="true">
      {Array.from({ length: 36 }, (_, index) => {
        const size = 2 + (index % 4)
        const style = {
          left: `${(index * 37) % 100}%`,
          top: `${8 + ((index * 23) % 84)}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDelay: `${-(index % 10) * 0.7}s`,
          animationDuration: `${7 + (index % 6)}s`,
        } satisfies CSSProperties

        return <span key={index} style={style} />
      })}
    </div>
  )
}

function Rating() {
  return (
    <div className="rating" aria-label="Five star rating display">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
      ))}
    </div>
  )
}

function SectionCopy({
  eyebrow,
  title,
  children,
  wide = false,
}: {
  eyebrow: string
  title: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <div className={`section-copy reveal${wide ? ' wide' : ''}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children}
    </div>
  )
}

function useDesktopAtmosphere() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const mobile = window.matchMedia('(max-width: 767px)')
    const update = () => setEnabled(!reduceMotion.matches && !mobile.matches)

    update()
    reduceMotion.addEventListener('change', update)
    mobile.addEventListener('change', update)

    return () => {
      reduceMotion.removeEventListener('change', update)
      mobile.removeEventListener('change', update)
    }
  }, [])

  return enabled
}

function App() {
  const pageRef = useRef<HTMLDivElement | null>(null)
  const glowRef = useRef<HTMLDivElement | null>(null)
  const scrollStoryRef = useRef<HTMLElement | null>(null)
  const showAtmosphere = useDesktopAtmosphere()

  useEffect(() => {
    const glow = glowRef.current
    if (!glow || window.matchMedia('(max-width: 767px)').matches) return

    const handlePointerMove = (event: PointerEvent) => {
      glow.style.setProperty('--cursor-x', `${event.clientX}px`)
      glow.style.setProperty('--cursor-y', `${event.clientY}px`)
      glow.dataset.active = 'true'
    }

    const handlePointerLeave = () => {
      delete glow.dataset.active
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  useGSAP(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduceMotion.matches) return

    gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, y: 28, filter: 'blur(10px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 82%',
            once: true,
          },
        },
      )
    })

    gsap.to('.scroll-progress-bar', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: pageRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.25,
      },
    })

    const cleanups = gsap.utils
      .toArray<HTMLElement>('.magnetic')
      .map((button) => {
        const xTo = gsap.quickTo(button, 'x', {
          duration: 0.35,
          ease: 'power3.out',
        })
        const yTo = gsap.quickTo(button, 'y', {
          duration: 0.35,
          ease: 'power3.out',
        })
        const move = (event: PointerEvent) => {
          const rect = button.getBoundingClientRect()
          xTo((event.clientX - rect.left - rect.width / 2) * 0.18)
          yTo((event.clientY - rect.top - rect.height / 2) * 0.22)
        }
        const leave = () => {
          xTo(0)
          yTo(0)
        }

        button.addEventListener('pointermove', move)
        button.addEventListener('pointerleave', leave)

        return () => {
          button.removeEventListener('pointermove', move)
          button.removeEventListener('pointerleave', leave)
        }
      })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, { scope: pageRef })

  return (
    <div ref={pageRef} className="luxury-page">
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true">
        <span className="scroll-progress-bar" />
      </div>
      <Header />
      <main>
        <section ref={scrollStoryRef} className="scroll-story">
          <div className="product-stage">
            <FrameSequenceCanvas scrollTargetRef={scrollStoryRef} />
            {showAtmosphere && (
              <Suspense fallback={null}>
                <LuxuryAtmosphere3D />
              </Suspense>
            )}
            <ParticleField />
            <div className="cinematic-vignette" />
            <div className="stage-reflection" />
          </div>

          <div className="story-content">
            <section id="hero" className="story-section hero-section">
              <img
                className="hero-product-poster"
                src="/assets/infinity-luxeus/preview/middle_frame.png"
                alt=""
                aria-hidden="true"
              />
              <div className="content-shell hero-grid">
                <div className="hero-copy">
                  <p className="eyebrow reveal">Luxury Eau De Parfum</p>
                  <h1 className="reveal">Infinity Luxeus Perfume</h1>
                  <p className="hero-tagline reveal">
                    Where Luxury Becomes Infinite
                  </p>
                  <p className="hero-microcopy reveal">
                    Luxury Eau De Parfum · 100ml · Signature Scent
                  </p>
                  <CTAButtons />
                  <div className="hero-next reveal">
                    <span>Scroll the reveal</span>
                  </div>
                </div>
                <div className="chapter-panel reveal" aria-label="Scroll story chapters">
                  {storyChapters.map(([label, copy]) => (
                    <article key={label}>
                      <span>{label}</span>
                      <p>{copy}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section id="story" className="story-section align-right">
              <div className="content-shell">
                <SectionCopy eyebrow="Presence" title="Crafted for Presence">
                  <p>
                    A signature fragrance designed to leave a refined,
                    unforgettable impression.
                  </p>
                </SectionCopy>
              </div>
            </section>

            <section id="notes" className="story-section">
              <div className="content-shell">
                <SectionCopy eyebrow="Scent" title="The Scent Profile" wide>
                  <div className="note-grid">
                    {scentNotes.map((note) => (
                      <article className="glass-card" key={note.label}>
                        <span>{note.label}</span>
                        <p>{note.value}</p>
                      </article>
                    ))}
                  </div>
                </SectionCopy>
              </div>
            </section>

            <section id="details" className="story-section align-right">
              <div className="content-shell">
                <SectionCopy eyebrow="Detail" title="Details That Define Luxury" wide>
                  <div className="detail-list">
                    {details.map((detail) => (
                      <article className="glass-card detail-card" key={detail}>
                        <CheckCircle2 size={18} aria-hidden="true" />
                        <span>{detail}</span>
                      </article>
                    ))}
                  </div>
                </SectionCopy>
              </div>
            </section>

            <section className="story-section">
              <div className="content-shell">
                <SectionCopy eyebrow="Aura" title="Built for Lasting Impact" wide>
                  <div className="benefit-grid">
                    {benefits.map((benefit) => {
                      const Icon = benefit.icon

                      return (
                        <article className="glass-card benefit-card" key={benefit.title}>
                          <Icon size={22} aria-hidden="true" />
                          <h3>{benefit.title}</h3>
                          <p>{benefit.copy}</p>
                        </article>
                      )
                    })}
                  </div>
                </SectionCopy>
              </div>
            </section>

            <section className="story-section mood-section">
              <div className="content-shell">
                <div className="mood-copy reveal">
                  <p className="eyebrow">Experience Mood</p>
                  <h2>Made for the Moment Before Everyone Looks</h2>
                  <div className="mood-lines">
                    {moodLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section id="order" className="story-section align-right order-section">
              <div className="content-shell">
                <article className="order-card reveal">
                  <p className="eyebrow">Private Order</p>
                  <h2>Infinity Luxeus Perfume</h2>
                  <p>Luxury Eau De Parfum</p>
                  <dl>
                    <div>
                      <dt>Size</dt>
                      <dd>100ml</dd>
                    </div>
                    <div>
                      <dt>Price</dt>
                      <dd>{pricePlaceholder}</dd>
                    </div>
                  </dl>
                  <div className="order-badges">
                    {trustBadges.map((badge) => {
                      const Icon = badge.icon

                      return (
                        <article key={badge.title}>
                          <Icon size={18} aria-hidden="true" />
                          <div>
                            <strong>{badge.title}</strong>
                            <span>{badge.copy}</span>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                  <div className="cta-row compact">
                    <a className="luxury-button magnetic" href={whatsappHref}>
                      <ShoppingBag size={18} aria-hidden="true" />
                      <span>Buy Now</span>
                    </a>
                    <a
                      className="ghost-button magnetic"
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle size={18} aria-hidden="true" />
                      <span>WhatsApp Order</span>
                    </a>
                  </div>
                </article>
              </div>
            </section>

            <section className="story-section">
              <div className="content-shell">
                <SectionCopy eyebrow="Trust" title="Trusted for Refined Moments" wide>
                  <div className="testimonial-grid">
                    {testimonials.map((testimonial) => (
                      <article className="glass-card testimonial-card" key={testimonial.name}>
                        <Rating />
                        <p>{testimonial.copy}</p>
                        <span>{testimonial.name}</span>
                      </article>
                    ))}
                  </div>
                </SectionCopy>
              </div>
            </section>

            <section className="story-section final-section">
              <div className="content-shell final-copy reveal">
                <p className="eyebrow">Final Impression</p>
                <h2>Experience Infinity Luxury</h2>
                <p>
                  A fragrance made for presence, memory, and distinction.
                </p>
                <a
                  className="luxury-button magnetic"
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  <span>Order on WhatsApp</span>
                </a>
              </div>
            </section>
          </div>
        </section>
      </main>

      <a
        className="mobile-sticky-cta"
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
      >
        <PackageCheck size={18} aria-hidden="true" />
        <span>Order Infinity Luxeus</span>
      </a>

      <footer className="site-footer">
        <div>
          <strong>Infinity Luxeus Perfume</strong>
          <span>A refined luxury Eau De Parfum for unforgettable presence.</span>
        </div>
        <nav aria-label="Footer">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a
          className="footer-order magnetic"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={17} aria-hidden="true" />
          <span>Order</span>
        </a>
      </footer>
    </div>
  )
}

export default App
