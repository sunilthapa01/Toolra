'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

function GradeCoverageView() {
  const rows = [
    { label: 'Common Core (US)', pct: 74 },
    { label: 'AP Track', pct: 62 },
    { label: 'CBSE (India)', pct: 55 },
    { label: 'Grade 9–12', pct: 48 },
    { label: 'Grade 6–8', pct: 35 },
    { label: 'International', pct: 26 },
  ]

  const barRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(barRef, { once: true, amount: 0.3 })

  return (
    <div
      ref={barRef}
      style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px 0' }}
    >
      {rows.map((row, index) => (
        <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              height: '38px',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #C0392B 0%, #FFD500 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '16px',
              color: '#fff',
              fontWeight: 600,
              fontSize: '14px',
              fontFamily: "'Outfit', sans-serif",
              width: isInView ? `${row.pct}%` : '0%',
              minWidth: isInView ? '60px' : '0px',
              transition: `width 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.08}s, min-width 0.3s ease ${index * 0.08}s`,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {row.pct}%
          </div>
          <div
            style={{
              fontSize: '15px',
              color: '#1C1917',
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 400,
              whiteSpace: 'nowrap',
              opacity: isInView ? 1 : 0,
              transition: `opacity 0.5s ease ${index * 0.08 + 0.3}s`,
            }}
          >
            {row.label}
          </div>
        </div>
      ))}
    </div>
  )
}

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.4 })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const dur = 1200
    const t0 = performance.now()
    let raf: number

    function step(t: number) {
      const k = Math.min(1, (t - t0) / dur)
      const eased = 1 - Math.pow(1 - k, 3)
      setDisplay(Math.round(target * eased))
      if (k < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [isInView, target])

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

export default function Analytics() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section
      ref={sectionRef}
      id="analytics"
      style={{ padding: '170px 80px', position: 'relative' }}
    >
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 400,
          fontSize: 'clamp(40px, 5.5vw, 84px)',
          lineHeight: 1.05,
          letterSpacing: '-0.035em',
          textAlign: 'center',
          maxWidth: '1200px',
          margin: '0 auto 64px',
        }}
      >
        Visual Intelligence
        <br />
        For Every Student
      </motion.h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}
      >
        {/* Left card — Grade Coverage */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          style={{
            background: '#EFE8DC',
            borderRadius: '28px',
            padding: '36px 32px 32px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <h3
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 400,
              fontSize: '32px',
              letterSpacing: '-0.02em',
              marginBottom: '24px',
            }}
          >
            Grade Coverage
          </h3>
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '28px',
              minHeight: '360px',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <GradeCoverageView />
          </div>
        </motion.div>

        {/* Right card — Optimizing Performance */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          style={{
            background: '#EFE8DC',
            borderRadius: '28px',
            padding: '36px 32px 32px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <h3
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 400,
              fontSize: '32px',
              letterSpacing: '-0.02em',
              marginBottom: '24px',
            }}
          >
            Learning Performance
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '220px 1fr',
              gap: '18px',
              alignItems: 'stretch',
              minHeight: '360px',
            }}
          >
            {/* Stat blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div
                style={{
                  borderRadius: '18px',
                  padding: '22px',
                  background: '#FFD500',
                  color: '#1C1917',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '168px',
                }}
              >
                <div style={{ fontSize: '14px', opacity: 0.95 }}>Cache Hit Rate</div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 400,
                    fontSize: '50px',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}
                >
                  +<Counter target={85} suffix="%" />
                </div>
              </div>
              <div
                style={{
                  borderRadius: '18px',
                  padding: '22px',
                  background: '#C0392B',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '168px',
                }}
              >
                <div style={{ fontSize: '14px', opacity: 0.95 }}>Concept Retention</div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 400,
                    fontSize: '50px',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}
                >
                  <Counter target={8} suffix="X" />
                </div>
              </div>
            </div>

            {/* Chart */}
            <div
              style={{
                background: '#fff',
                borderRadius: '18px',
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  background: '#EFE8DC',
                  borderRadius: '999px',
                  padding: '5px',
                  alignSelf: 'flex-start',
                  marginBottom: '12px',
                }}
              >
                {['3 days', '1 week', '1 month', '3 months', '6 months', '1 year'].map((tab, i) => (
                  <span
                    key={tab}
                    style={{
                      fontSize: '13px',
                      padding: '6px 12px',
                      borderRadius: '999px',
                      color: i === 1 ? '#fff' : '#1C1917',
                      background: i === 1 ? '#1C1917' : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    {tab}
                  </span>
                ))}
              </div>

              <div style={{ flex: 1, position: 'relative' }}>
                <svg viewBox="0 0 500 250" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <linearGradient id="optAreaG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C0392B" />
                      <stop offset="100%" stopColor="#C0392B" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <g stroke="#DDD5C6" strokeWidth="1" strokeDasharray="3 4">
                    <line x1="0" y1="50" x2="500" y2="50" />
                    <line x1="0" y1="100" x2="500" y2="100" />
                    <line x1="0" y1="150" x2="500" y2="150" />
                    <line x1="0" y1="200" x2="500" y2="200" />
                  </g>
                  <path
                    d="M 0 180 L 90 170 L 180 150 L 270 200 L 360 90 L 500 30"
                    stroke="#C0392B"
                    strokeWidth="3.5"
                    fill="none"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 0 180 L 90 170 L 180 150 L 270 200 L 360 90 L 500 30 L 500 250 L 0 250 Z"
                    fill="url(#optAreaG)"
                    opacity="0.18"
                  />
                  <circle cx="180" cy="150" r="6" fill="#C0392B" />
                  <circle cx="360" cy="90" r="6" fill="#C0392B" />
                  <line x1="180" y1="158" x2="180" y2="250" stroke="#C0392B" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
                  <line x1="360" y1="98" x2="360" y2="250" stroke="#C0392B" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    background: '#1C1917',
                    color: '#fff',
                    fontSize: '12px',
                    padding: '5px 10px',
                    borderRadius: '999px',
                    transform: 'translate(-50%, -120%)',
                    pointerEvents: 'none',
                    left: '36%',
                    top: '50%',
                  }}
                >
                  +3x
                </div>
                <div
                  style={{
                    position: 'absolute',
                    background: '#1C1917',
                    color: '#fff',
                    fontSize: '12px',
                    padding: '5px 10px',
                    borderRadius: '999px',
                    transform: 'translate(-50%, -120%)',
                    pointerEvents: 'none',
                    left: '72%',
                    top: '28%',
                  }}
                >
                  +8x
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
