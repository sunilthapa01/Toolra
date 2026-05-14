'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Nav() {
  const [isPink, setIsPink] = useState(false)

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
        top: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 96px)',
        maxWidth: '1392px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        pointerEvents: 'none',
      }}
    >
      <a
        href="#"
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: '28px',
          letterSpacing: '-0.04em',
          color: isPink ? '#ff5ca8' : '#0a0a0a',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'baseline',
          transition: 'color 0.4s ease',
          pointerEvents: 'auto',
        }}
      >
        wollo
      </a>

      <div
        style={{
          background: 'rgba(245, 245, 247, 0.92)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '999px',
          padding: '12px 8px',
          display: 'flex',
          gap: '4px',
          pointerEvents: 'auto',
        }}
        className="hidden md:flex"
      >
        {['Features', 'Integrations', 'Pricing', 'About us', 'Contact'].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase().replace(' ', '')}`}
            style={{
              color: '#0a0a0a',
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
            color: '#0a0a0a',
            textDecoration: 'none',
            fontSize: '15px',
            padding: '8px 12px',
          }}
        >
          Log in
        </a>
        <a
          href="#"
          style={{
            background: '#0a0a0a',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '15px',
            padding: '12px 22px',
            borderRadius: '999px',
            border: 'none',
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
            e.currentTarget.style.background = '#0a0a0a'
          }}
        >
          Start Free Trial
        </a>
      </div>
    </nav>
  )
}
