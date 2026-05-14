'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'

const VIEWS = [
  { title: 'Hashtag Performance', barColor: '#5b3cff', barClass: 'bar-purple' },
  { title: 'Audience Demographics', barColor: '#ff5ca8', barClass: 'bar-pink' },
  { title: 'Average Response Time', barColor: '#fbd838', barClass: 'bar-yellow' },
]

function HashpileView() {
  const tags = [
    { text: '#Nature', top: '18%', left: '32%', rotate: '-7deg' },
    { text: '#Art', top: '20%', left: '52%', rotate: '6deg' },
    { text: '#Cooking', top: '30%', left: '8%', rotate: '-9deg' },
    { text: '#Photography', top: '32%', left: '64%', rotate: '-4deg' },
    { text: '#Fun', top: '44%', left: '38%', rotate: '2deg' },
    { text: '#AI', top: '44%', left: '56%', rotate: '-1deg' },
    { text: '#Travel', top: '56%', left: '14%', rotate: '8deg' },
    { text: '#Selfie', top: '58%', left: '30%', rotate: '-6deg' },
    { text: '#Explore', top: '56%', left: '50%', rotate: '4deg' },
    { text: '#Fitness', top: '56%', left: '70%', rotate: '-3deg' },
    { text: '#Foodie', top: '72%', left: '30%', rotate: '-2deg' },
    { text: '#Movie', top: '72%', left: '52%', rotate: '5deg' },
  ]

  return (
    <div style={{ position: 'relative', height: '280px' }}>
      {tags.map((tag) => (
        <div
          key={tag.text}
          style={{
            position: 'absolute',
            border: '1px solid #d8d8de',
            background: '#fff',
            borderRadius: '999px',
            padding: '10px 22px',
            fontSize: '19px',
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 400,
            color: '#0a0a0a',
            whiteSpace: 'nowrap',
            top: tag.top,
            left: tag.left,
            transform: `rotate(${tag.rotate})`,
          }}
        >
          {tag.text}
        </div>
      ))}
    </div>
  )
}

function DemographicsView() {
  const rows = [
    { label: 'Pet Owners', pct: 74 },
    { label: 'Travelers', pct: 50 },
    { label: 'Parents', pct: 45 },
    { label: 'Foodies', pct: 42 },
    { label: 'Fitness Enthusiasts', pct: 37 },
    { label: 'Fashionistas', pct: 26 },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '8px 0' }}>
      {rows.map((row) => (
        <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              height: '36px',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #ff6fb1 0%, #ffb3d1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '14px',
              color: '#fff',
              fontWeight: 500,
              fontSize: '14px',
              boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.4)',
              width: `${row.pct}%`,
              minWidth: '60px',
            }}
          >
            {row.pct}%
          </div>
          <div style={{ fontSize: '16px', color: '#0a0a0a' }}>{row.label}</div>
        </div>
      ))}
    </div>
  )
}

function ResponseTimeView() {
  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <span
          style={{
            background: '#0a0a0a',
            color: '#fff',
            borderRadius: '999px',
            padding: '6px 14px',
            fontSize: '13px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              display: 'inline-grid',
              gridTemplateColumns: 'repeat(2, 3px)',
              gridTemplateRows: 'repeat(2, 3px)',
              gap: '1px',
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <i
                key={i}
                style={{
                  background: 'currentColor',
                  display: 'block',
                  width: '3px',
                  height: '3px',
                  borderRadius: '999px',
                }}
              />
            ))}
          </span>
          by channel
        </span>
        <span
          style={{
            background: '#fff',
            color: '#0a0a0a',
            border: '1px solid #e0e0e3',
            borderRadius: '999px',
            padding: '6px 14px',
            fontSize: '13px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span
            style={{
              display: 'inline-grid',
              gridTemplateColumns: 'repeat(2, 3px)',
              gridTemplateRows: 'repeat(2, 3px)',
              gap: '1px',
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <i
                key={i}
                style={{
                  background: 'currentColor',
                  display: 'block',
                  width: '3px',
                  height: '3px',
                  borderRadius: '999px',
                }}
              />
            ))}
          </span>
          by content type
        </span>
      </div>
      <div style={{ position: 'relative', height: '280px' }}>
        <svg viewBox="0 0 400 250" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path
            d="M 0 160 Q 40 100, 80 140 T 160 130 Q 200 160, 240 80 T 320 120 T 400 110"
            stroke="#fbd838"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="240" cy="98" r="6" fill="#fbd838" />
          <line x1="240" y1="110" x2="240" y2="230" stroke="#d4d4d8" strokeWidth="1" strokeDasharray="2 3" />
        </svg>
        <div
          style={{
            position: 'absolute',
            background: '#0a0a0a',
            color: '#fff',
            fontSize: '12px',
            padding: '5px 10px',
            borderRadius: '999px',
            transform: 'translate(-50%, -120%)',
            pointerEvents: 'none',
            left: '60%',
            top: '36%',
          }}
        >
          8:05 min
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '4px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#999',
          }}
        >
          <span>Oct</span>
          <span>Mar</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
        </div>
      </div>
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
  const [viewIndex, setViewIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setViewIndex((prev) => (prev + 1) % 3)
    }, 3500)
    return () => clearInterval(id)
  }, [])

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section
      ref={sectionRef}
      id="analytics"
      style={{ padding: '120px 80px', position: 'relative' }}
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
        Advanced Analytics
        <br />
        and Reporting
      </motion.h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
        }}
      >
        {/* Left card — rotating views */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          style={{
            background: '#f5f5f7',
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
            {VIEWS[viewIndex].title}
          </h3>
          <div
            style={{
              background: '#fff',
              borderRadius: '20px',
              padding: '28px',
              minHeight: '360px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={viewIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {viewIndex === 0 && <HashpileView />}
                {viewIndex === 1 && <DemographicsView />}
                {viewIndex === 2 && <ResponseTimeView />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress bars */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '22px', padding: '0 4px' }}>
            {VIEWS.map((v, i) => (
              <span
                key={i}
                style={{
                  height: '5px',
                  flex: 1,
                  borderRadius: '999px',
                  background:
                    i === viewIndex
                      ? i === 0
                        ? '#5b3cff'
                        : i === 1
                        ? '#ff5ca8'
                        : '#fbd838'
                      : '#e5e5ea',
                  transition: 'background 0.35s ease',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Right card — Optimizing Performance */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          style={{
            background: '#f5f5f7',
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
            Optimizing Performance
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
                  background: '#fbd838',
                  color: '#0a0a0a',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '168px',
                }}
              >
                <div style={{ fontSize: '14px', opacity: 0.95 }}>Engagement Rate</div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 400,
                    fontSize: '50px',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}
                >
                  +<Counter target={64} suffix="%" />
                </div>
              </div>
              <div
                style={{
                  borderRadius: '18px',
                  padding: '22px',
                  background: '#ff5ca8',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '168px',
                }}
              >
                <div style={{ fontSize: '14px', opacity: 0.95 }}>Followers</div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 400,
                    fontSize: '50px',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                  }}
                >
                  +<Counter target={70} suffix=" %" />
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
                  background: '#f1f1f4',
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
                      color: i === 1 ? '#fff' : '#0a0a0a',
                      background: i === 1 ? '#0a0a0a' : 'transparent',
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
                      <stop offset="0%" stopColor="#ff5ca8" />
                      <stop offset="100%" stopColor="#ff5ca8" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <g stroke="#e5e5ea" strokeWidth="1" strokeDasharray="3 4">
                    <line x1="0" y1="50" x2="500" y2="50" />
                    <line x1="0" y1="100" x2="500" y2="100" />
                    <line x1="0" y1="150" x2="500" y2="150" />
                    <line x1="0" y1="200" x2="500" y2="200" />
                  </g>
                  <path
                    d="M 0 180 L 90 170 L 180 150 L 270 200 L 360 90 L 500 30"
                    stroke="#ff5ca8"
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
                  <circle cx="180" cy="150" r="6" fill="#ff5ca8" />
                  <circle cx="360" cy="90" r="6" fill="#ff5ca8" />
                  <line x1="180" y1="158" x2="180" y2="250" stroke="#ff5ca8" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
                  <line x1="360" y1="98" x2="360" y2="250" stroke="#ff5ca8" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
                </svg>
                <div
                  style={{
                    position: 'absolute',
                    background: '#0a0a0a',
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
                  +46%
                </div>
                <div
                  style={{
                    position: 'absolute',
                    background: '#0a0a0a',
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
                  +67%
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
