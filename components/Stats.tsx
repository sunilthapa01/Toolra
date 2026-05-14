'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface StatRowData {
  artBg: string
  artSvg: React.ReactNode
  prefix: string
  countTo: number
  suffix: string
  pillColor: string
  pillLabel: string
  desc: string
}

function AnimatedCounter({
  target,
  suffix,
  prefix,
}: {
  target: number
  suffix: string
  prefix: string
}) {
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
    <span
      ref={ref}
      style={{
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 400,
        fontSize: 'clamp(80px, 11vw, 168px)',
        letterSpacing: '-0.04em',
        lineHeight: 1,
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

function StatPill({
  children,
  color,
  rowRef,
}: {
  children: React.ReactNode
  color: string
  rowRef: React.RefObject<HTMLDivElement | null>
}) {
  const pillRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const pill = pillRef.current
    const row = rowRef.current
    if (!pill || !row) return

    const tween = gsap.fromTo(
      pill,
      { rotation: -6, y: 0 },
      {
        rotation: -2,
        y: -6,
        ease: 'sine.inOut',
        scrollTrigger: {
          trigger: row,
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
  }, [rowRef])

  return (
    <span
      ref={pillRef}
      style={{
        position: 'absolute',
        borderRadius: '999px',
        fontSize: '16px',
        color: '#fff',
        padding: '8px 18px',
        top: '-28px',
        left: '30%',
        transform: 'rotate(-6deg)',
        willChange: 'transform',
        background: color,
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  )
}

const statRows: StatRowData[] = [
  {
    artBg: '#3826c6',
    artSvg: (
      <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect width="240" height="240" fill="#3826c6" />
        <path
          d="M 60 80 Q 120 40 180 100 Q 200 140 150 160 Q 100 180 60 140 Z"
          fill="#2618a0"
        />
        <circle cx="170" cy="100" r="12" fill="#4d8cff" />
        <path d="M 80 70 L 92 50 L 96 70 Z" fill="#ff5ca8" />
        <path d="M 90 60 Q 95 40 100 60" stroke="#ff5ca8" strokeWidth="2" fill="none" />
        <rect
          x="100"
          y="140"
          width="60"
          height="50"
          rx="6"
          fill="#ff7733"
          transform="rotate(-12 130 165)"
        />
        <path
          d="M 120 155 L 130 145 L 140 155 L 140 175 L 120 175 Z"
          fill="#fbd838"
          transform="rotate(-12 130 165)"
        />
      </svg>
    ),
    prefix: '+',
    countTo: 258,
    suffix: 'K',
    pillColor: '#ff6b35',
    pillLabel: 'Users',
    desc: "Wollo's Intelligent Algorithms analyze social media data in real-time, offering actionable insights and recommendations",
  },
  {
    artBg: '#6f5fff',
    artSvg: (
      <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect width="240" height="240" fill="#6f5fff" />
        <ellipse cx="120" cy="120" rx="50" ry="80" fill="none" stroke="#3826c6" strokeWidth="14" />
        <ellipse
          cx="120"
          cy="120"
          rx="50"
          ry="80"
          fill="none"
          stroke="#3826c6"
          strokeWidth="14"
          transform="rotate(60 120 120)"
        />
        <ellipse
          cx="120"
          cy="120"
          rx="50"
          ry="80"
          fill="none"
          stroke="#5b4eff"
          strokeWidth="14"
          transform="rotate(120 120 120)"
        />
        <rect x="100" y="100" width="40" height="40" rx="4" fill="#fbd838" />
        <path d="M 100 100 L 120 120 L 140 100" fill="#ff7733" />
      </svg>
    ),
    prefix: '',
    countTo: 8,
    suffix: 'X',
    pillColor: '#ff5ca8',
    pillLabel: 'Increase in Traffic',
    desc: 'Track and analyze the impact of your social media campaigns in real-time, pinpointing which strategies drive the most traffic, allowing you to refine your approach',
  },
  {
    artBg: '#3826c6',
    artSvg: (
      <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
        <rect width="240" height="240" fill="#3826c6" />
        <circle cx="80" cy="100" r="30" fill="#6f5fff" />
        <circle cx="80" cy="100" r="14" fill="#fbd838" />
        <rect
          x="120"
          y="80"
          width="60"
          height="80"
          rx="10"
          fill="#1a0e5e"
          transform="rotate(12 150 120)"
        />
        <rect x="60" y="120" width="50" height="40" rx="8" fill="#ff8db8" />
        <circle cx="80" cy="138" r="6" fill="#5b3cff" />
        <circle cx="100" cy="138" r="6" fill="#5b3cff" />
      </svg>
    ),
    prefix: '+',
    countTo: 39,
    suffix: 'h',
    pillColor: '#5b3cff',
    pillLabel: 'Saved Weekly',
    desc: 'Effortlessly save time and with our automated scheduling and content management tools, ensuring consistent posting and engagement',
  },
]

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })
  const rowRefs = useRef<Array<React.RefObject<HTMLDivElement | null>>>([
    { current: null },
    { current: null },
    { current: null },
  ])

  return (
    <section
      ref={sectionRef}
      style={{ padding: '160px 80px 180px' }}
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
          margin: '0 auto 100px',
        }}
      >
        {"Wollo's Intelligent Algorithms"}
        <br />
        Analyze Social Media Data in
        <br />
        Real-Time, offering...
      </motion.h2>

      {statRows.map((row, i) => {
        const rowRef = rowRefs.current[i] as React.RefObject<HTMLDivElement>
        return (
          <motion.div
            key={i}
            ref={rowRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            style={{
              display: 'grid',
              gridTemplateColumns: '280px 1fr 320px',
              alignItems: 'center',
              gap: '60px',
              padding: '60px 0',
              borderBottom: i < statRows.length - 1 ? '1px solid #ececef' : 'none',
            }}
          >
            {/* Art square */}
            <div
              style={{
                width: '240px',
                height: '240px',
                borderRadius: '28px',
                overflow: 'hidden',
                position: 'relative',
                background: row.artBg,
              }}
            >
              {row.artSvg}
            </div>

            {/* Big stat */}
            <div>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <StatPill color={row.pillColor} rowRef={rowRef as React.RefObject<HTMLDivElement>}>
                  {row.pillLabel}
                </StatPill>
                <AnimatedCounter
                  target={row.countTo}
                  suffix={row.suffix}
                  prefix={row.prefix}
                />
              </div>
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: '17px',
                lineHeight: 1.55,
                color: '#0a0a0a',
                maxWidth: '320px',
              }}
            >
              {row.desc}
            </div>
          </motion.div>
        )
      })}
    </section>
  )
}
