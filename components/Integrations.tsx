'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Integrations() {
  const envRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const envEl = envRef.current
    if (!envEl) return

    const tween = gsap.fromTo(
      envEl,
      { x: 0, y: 0, rotation: 0 },
      {
        x: 60,
        y: -10,
        rotation: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: envEl,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      }
    )

    ScrollTrigger.refresh()

    return () => {
      tween.scrollTrigger?.kill()
    }
  }, [])

  return (
    <section
      id="integrations"
      style={{
        position: 'relative',
        textAlign: 'center',
        padding: '200px 80px 200px',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Floating envelope */}
      <div
        ref={envRef}
        style={{
          position: 'absolute',
          width: '200px',
          height: '140px',
          left: 'calc(50% - 320px)',
          top: '16%',
          willChange: 'transform',
          zIndex: 10,
        }}
      >
        <svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          <g transform="rotate(-12 100 70)">
            <rect x="10" y="20" width="160" height="110" rx="10" fill="#1C1917" />
            <path d="M 10 30 L 90 90 L 170 30" stroke="#fff" strokeWidth="2" fill="none" />
            <circle cx="40" cy="80" r="8" fill="#FFD500" />
            <rect x="120" y="40" width="32" height="32" rx="6" fill="#fff" />
            <rect x="128" y="48" width="16" height="16" rx="3" fill="none" stroke="#1C1917" strokeWidth="2" />
            <rect x="132" y="52" width="8" height="8" fill="#1C1917" />
          </g>
        </svg>
      </div>

      {/* Giant heading */}
      <div
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 400,
          fontSize: 'clamp(80px, 11vw, 168px)',
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0,
          flexWrap: 'wrap',
        }}
      >
        <span>Explore</span>
        <span
          style={{
            background: '#FFD500',
            color: '#FFD500',
            padding: '6px 22px 14px',
            borderRadius: '22px',
            marginLeft: '18px',
            transform: 'translateY(8px)',
            overflow: 'hidden',
            position: 'relative',
            lineHeight: 0.95,
            display: 'inline-block',
          }}
        >
          <span
            style={{
              color: 'rgba(0,0,0,0.18)',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              letterSpacing: '-0.05em',
            }}
          >
            prologue
          </span>
        </span>
      </div>
    </section>
  )
}
