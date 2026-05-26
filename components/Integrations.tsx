'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Integrations() {
  const envRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLDivElement>(null)

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

  // Scroll-triggered letter animation for "prologue"
  useEffect(() => {
    const el = wordRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view')
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
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
          height: '220px',
          left: 'calc(50% - 320px)',
          top: '16%',
          willChange: 'transform',
          zIndex: 10,
        }}
      >
        <div className="animated-mail-wrapper">
          <div className="animated-mail">
            <div className="back-fold"></div>
            <div className="letter">
              <div className="letter-border"></div>
              <div className="letter-text">
                <p className="letter-hi">Hi,</p>
                <p className="letter-name">It&apos;s me<br/>Prologue</p>
              </div>
              <div className="letter-stamp">
                <div className="letter-stamp-inner"></div>
              </div>
            </div>
            <div className="top-fold"></div>
            <div className="mail-body"></div>
            <div className="left-fold"></div>
          </div>
          <div className="mail-shadow"></div>
        </div>
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
            padding: '6px 22px 44px',
            borderRadius: '22px',
            marginLeft: '18px',
            transform: 'translateY(8px)',
            overflow: 'hidden',
            position: 'relative',
            lineHeight: 0.95,
            display: 'inline-block',
          }}
        >
          <div
            ref={wordRef}
            className="scroll-word-animate"
            style={{
              display: 'inline-flex',
              color: '#000000',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              letterSpacing: '-0.05em',
            }}
          >
            {'prologue'.split('').map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </div>
        </span>
      </div>
    </section>
  )
}
