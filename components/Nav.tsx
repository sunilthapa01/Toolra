'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Nav() {
  const [isPink, setIsPink] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const integrationsEl = document.getElementById('integrations')
    if (!integrationsEl) return

    const st = ScrollTrigger.create({
      trigger: integrationsEl,
      start: 'top 55%',
      end: 'bottom 30%',
      onEnter: () => setIsPink(true),
      onLeave: () => setIsPink(false),
      onEnterBack: () => setIsPink(true),
      onLeaveBack: () => setIsPink(false),
    })

    ScrollTrigger.refresh()

    return () => {
      st.kill()
    }
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: scrolled ? '20px' : '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 96px)',
        maxWidth: '1392px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: scrolled ? '12px 32px' : '0 32px',
        pointerEvents: 'none',
        background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderRadius: scrolled ? '999px' : '0',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03)' : 'none',
        border: scrolled ? '1px solid rgba(255,255,255,0.6)' : '1px solid transparent',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <a
        href="#"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          pointerEvents: 'auto',
          color: isPink ? '#C0392B' : '#1C1917',
          transition: 'color 0.4s ease',
        }}
        aria-label="Prologue Home"
      >
        <svg
          viewBox="50 40 320 90"
          height="44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M 72 47 C 108 47 126 62 126 85 C 126 108 108 123 72 123 Z" fill="#C4402F" />
          <rect
            x="60"
            y="45"
            width="16"
            height="80"
            rx="3"
            fill="currentColor"
          />
          <text
            x="144"
            y="105"
            fontSize="44"
            fill="currentColor"
            letterSpacing="5"
            style={{
              fontFamily: 'Georgia, "Book Antiqua", Palatino, serif',
            }}
          >
            Prologue
          </text>
        </svg>
      </a>

      <div
        style={{
          background: scrolled ? 'transparent' : 'rgba(239, 232, 220, 0.92)',
          backdropFilter: scrolled ? 'none' : 'blur(10px)',
          WebkitBackdropFilter: scrolled ? 'none' : 'blur(10px)',
          borderRadius: '999px',
          padding: '12px 8px',
          display: 'flex',
          gap: '4px',
          pointerEvents: 'auto',
          transition: 'background 0.35s ease',
        }}
        className="hidden md:flex"
      >
        {['Features', 'How It Works', 'Pricing', 'About', 'Contact'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(' ', '')}`}
            style={{
              color: '#1C1917',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 400,
              padding: '8px 18px',
              borderRadius: '999px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.06)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {item}
          </a>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          pointerEvents: 'auto',
        }}
      >
        <a
          href="#"
          style={{
            background: '#1C1917',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '15px',
            padding: '12px 22px',
            borderRadius: '999px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'transform 0.2s, background 0.2s',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.background = '#222'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.background = '#1C1917'
          }}
        >
          Log in
        </a>
      </div>
    </nav>
  )
}
