'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
          color: '#0a0a0a',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        Maximize Your Social
        <br />
        Media Presence
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
            background: '#5b3cff',
            color: '#fff',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          Start Free Trial
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
            border: '1px solid #e0e0e3',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'transform 0.2s, opacity 0.2s',
            background: '#fff',
            color: '#0a0a0a',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          Create Free Account
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
        }}
      >
        <div
          ref={heroArtInnerRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: '100%',
            aspectRatio: '16 / 8.5',
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
              background: '#fbd838',
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
              background: '#ff5ca8',
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
              background: '#3826c6',
              transform: 'rotate(0deg)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              <svg
                viewBox="0 0 1200 640"
                preserveAspectRatio="xMidYMid slice"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', height: '100%', display: 'block' }}
              >
                <defs>
                  <radialGradient id="lensG" cx="0.35" cy="0.35" r="0.7">
                    <stop offset="0%" stopColor="#ffd6c2" />
                    <stop offset="30%" stopColor="#c4a3e8" />
                    <stop offset="70%" stopColor="#4a3aa8" />
                    <stop offset="100%" stopColor="#1a0e5e" />
                  </radialGradient>
                  <linearGradient id="heartG" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#ffd1e3" />
                    <stop offset="50%" stopColor="#ff8dbf" />
                    <stop offset="100%" stopColor="#e64a8f" />
                  </linearGradient>
                  <linearGradient id="heartSide" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff8b3a" />
                    <stop offset="100%" stopColor="#e25416" />
                  </linearGradient>
                  <pattern id="noise" width="3" height="3" patternUnits="userSpaceOnUse">
                    <rect width="3" height="3" fill="transparent" />
                    <circle cx="1" cy="1" r="0.4" fill="rgba(255,255,255,0.06)" />
                  </pattern>
                  <pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.9" fill="rgba(255,255,255,0.25)" />
                  </pattern>
                </defs>

                <rect width="1200" height="640" fill="#3826c6" />
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
                    fill="#1a0e5e"
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
                <path d="M 1050 540 l 8 -20 l 8 20 z" fill="#ff5ca8" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
