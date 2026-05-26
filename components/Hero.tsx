'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import HeroGraph from '@/components/HeroGraph'

export default function Hero() {
  const heroArtRef = useRef<HTMLDivElement>(null)
  const heroArtInnerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const heroArt = heroArtRef.current
    const heroArtInner = heroArtInnerRef.current

    if (!heroArt || !heroArtInner) return

    const tl = gsap.fromTo(
      heroArtInner,
      { rotation: -6, scale: 1, y: 0 },
      {
        rotation: 0,
        scale: 1.35,
        y: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: heroArt,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1.5,
        },
      }
    )

    ScrollTrigger.refresh()

    return () => {
      tl.scrollTrigger?.kill()
    }
  }, [])

  return (
    <section
      style={{
        minHeight: '100vh',
        padding: '180px 80px 0',
        position: 'relative',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 400,
          fontSize: 'clamp(48px, 6.6vw, 92px)',
          lineHeight: 1.0,
          letterSpacing: '-0.035em',
          color: '#1C1917',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        The Fastest Way
        <br />
        To Understand Anything.
      </h1>

      <div
        style={{
          marginTop: '44px',
          display: 'flex',
          gap: '14px',
          justifyContent: 'center',
        }}
      >
        <a
          href="#"
          style={{
            padding: '14px 26px',
            borderRadius: '999px',
            fontFamily: 'inherit',
            fontSize: '15px',
            fontWeight: 400,
            cursor: 'pointer',
            border: 'none',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'transform 0.2s, opacity 0.2s',
            background: '#C0392B',
            color: '#fff',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          Start for Free
        </a>
        <a
          href="#"
          style={{
            padding: '14px 26px',
            borderRadius: '999px',
            fontFamily: 'inherit',
            fontSize: '15px',
            fontWeight: 400,
            cursor: 'pointer',
            border: '1px solid #DDD5C6',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'transform 0.2s, opacity 0.2s',
            background: '#fff',
            color: '#1C1917',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          See It in Action
        </a>
      </div>

      {/* Hero art wrap */}
      <div
        ref={heroArtRef}
        id="heroArt"
        style={{
          position: 'relative',
          marginTop: '80px',
          height: '100vh',
          perspective: '1200px',
          marginBottom: '100px',
        }}
      >
        <div
          ref={heroArtInnerRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '90%',
            height: '100%',
            transform: 'translateX(-50%) rotate(-6deg) scale(1)',
            transformOrigin: 'center center',
            willChange: 'transform',
          }}
        >
          {/* Yellow card */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '36px',
              overflow: 'hidden',
              background: '#FFD500',
              transform: 'translate(2.5%, -2%) rotate(2deg)',
              opacity: 0.95,
            }}
          />
          {/* Pink card */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '36px',
              overflow: 'hidden',
              background: '#C0392B',
              transform: 'translate(-1.5%, -0.5%) rotate(-1deg)',
            }}
          />
          {/* Main deep-purple card with illustration */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '36px',
              overflow: 'hidden',
              background: '#1C1917',
              transform: 'rotate(0deg)',
            }}
          >
            {/* Animated knowledge graph — background layer */}
            <HeroGraph />

            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <svg
                viewBox="0 0 1200 640"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', height: '100%', display: 'block' }}
              >
                <defs>
                  <radialGradient id="lensG" cx="0.35" cy="0.35" r="0.7">
                    <stop offset="0%" stopColor="#FFE566" />
                    <stop offset="30%" stopColor="#F7F2EA" />
                    <stop offset="70%" stopColor="#922B21" />
                    <stop offset="100%" stopColor="#1C1917" />
                  </radialGradient>
                  <linearGradient id="heartG" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFE566" />
                    <stop offset="50%" stopColor="#C0392B" />
                    <stop offset="100%" stopColor="#A83226" />
                  </linearGradient>
                  <linearGradient id="heartSide" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A83226" />
                    <stop offset="100%" stopColor="#922B21" />
                  </linearGradient>
                  <pattern id="noise" width="3" height="3" patternUnits="userSpaceOnUse">
                    <rect width="3" height="3" fill="transparent" />
                    <circle cx="1" cy="1" r="0.4" fill="rgba(255,255,255,0.06)" />
                  </pattern>
                  <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.9" fill="rgba(255,255,255,0.25)" />
                  </pattern>
                </defs>

                {/* No solid background rect — canvas shows through */}
                <rect width="1200" height="640" fill="url(#noise)" />

                {/* white arcs */}
                <circle cx="430" cy="380" r="220" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <circle cx="430" cy="380" r="260" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

                {/* camera lens */}
                <circle cx="430" cy="380" r="155" fill="url(#lensG)" />
                <circle cx="500" cy="430" r="38" fill="rgba(255,255,255,0.18)" />
                <path
                  d="M 380 420 a 50 50 0 0 0 100 0"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="0.5"
                  fill="none"
                  strokeDasharray="1 3"
                />
                <ellipse
                  cx="450"
                  cy="410"
                  rx="60"
                  ry="30"
                  fill="url(#dots)"
                  transform="rotate(-15 450 410)"
                />

                {/* 3D heart */}
                <g transform="translate(820, 320)">
                  <path
                    d="M 0 30 C -50 -10, -110 -10, -110 60 C -110 130, -10 200, 0 240 L 24 240 C 14 200, 114 130, 114 60 C 114 -10, 54 -10, 24 30 Z"
                    fill="url(#heartSide)"
                    transform="translate(-12, 14)"
                  />
                  <path
                    d="M 0 30 C -50 -10, -110 -10, -110 60 C -110 130, -10 200, 0 240 C 10 200, 110 130, 110 60 C 110 -10, 50 -10, 0 30 Z"
                    fill="url(#heartG)"
                  />
                  <path
                    d="M 0 75 C -22 55, -60 60, -60 95 C -60 140, -10 175, 0 195 C 10 175, 60 140, 60 95 C 60 60, 22 55, 0 75 Z"
                    fill="#1C1917"
                  />
                  <path
                    d="M 0 75 C -22 55, -60 60, -60 95 C -60 140, -10 175, 0 195 C 10 175, 60 140, 60 95 C 60 60, 22 55, 0 75 Z"
                    fill="url(#noise)"
                  />
                </g>

                {/* string lines */}
                <path d="M 580 460 Q 700 440 820 410" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none" />
                <path d="M 200 200 Q 500 180 940 220" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />

                {/* small accents */}
                <circle cx="170" cy="500" r="14" fill="rgba(255,255,255,0.25)" />
                <path d="M 1050 540 l 8 -20 l 8 20 z" fill="#C0392B" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
