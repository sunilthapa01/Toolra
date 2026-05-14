'use client'

import { motion } from 'framer-motion'

const featureCards = [
  {
    col: 1,
    yOffset: 80,
    headText: 'Any Concept,\nAny Grade',
    label: 'AI Visual Generation',
    num: '01',
    bg: '#C0392B',
    textColor: '#fff',
    illu: (
      <svg
        style={{ position: 'absolute', right: '-6%', top: '-10%', width: '60%', opacity: 0.95 }}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="120" cy="80" rx="40" ry="50" fill="#E8967A" />
        <rect x="110" y="40" width="20" height="20" fill="#FFD500" />
        <path d="M 100 60 L 115 30 L 130 60 Z" fill="#FFE566" />
        <ellipse cx="120" cy="80" rx="22" ry="30" fill="rgba(0,0,0,0.2)" />
      </svg>
    ),
  },
  {
    col: 2,
    yOffset: 0,
    headText: 'Touch, Drag,\nExplore',
    label: 'Interactive Learning',
    num: '02',
    bg: '#FFD500',
    textColor: '#1C1917',
    illu: (
      <svg
        style={{ position: 'absolute', right: '-6%', top: '-10%', width: '60%', opacity: 0.95 }}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 100 50 C 70 30, 30 30, 30 70 C 30 110, 90 150, 100 165 C 110 150, 170 110, 170 70 C 170 30, 130 30, 100 50 Z"
          fill="#E8967A"
        />
        <path
          d="M 100 70 C 80 55, 50 55, 50 80 C 50 110, 95 145, 100 155 C 105 145, 150 110, 150 80 C 150 55, 120 55, 100 70 Z"
          fill="#1C1917"
        />
        <path
          d="M 90 165 C 70 145, 30 110, 30 70 C 30 50, 38 38, 50 32 L 50 145 Z"
          fill="#C0392B"
          opacity="0.5"
        />
      </svg>
    ),
  },
  {
    col: 3,
    yOffset: 40,
    headText: 'Never Just\nan Answer',
    label: 'Built for Understanding',
    num: '03',
    bg: '#1C1917',
    textColor: '#fff',
    illu: (
      <svg
        style={{ position: 'absolute', right: '-6%', top: '-10%', width: '60%', opacity: 0.95 }}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="rotate(-14 100 100)">
          <rect x="20" y="60" width="160" height="100" rx="10" fill="#C0392B" />
          <path d="M 20 70 L 100 130 L 180 70" stroke="#fff" strokeWidth="2" fill="none" />
          <circle cx="50" cy="120" r="8" fill="#FFD500" />
          <rect x="130" y="80" width="30" height="30" rx="6" fill="#EFE8DC" />
        </g>
      </svg>
    ),
  },
]

export default function Features() {
  return (
    <section
      id="features"
      style={{ padding: '120px 80px 200px' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          alignItems: 'end',
          perspective: '1200px',
        }}
      >
        {featureCards.map((card, i) => (
          <motion.div
            key={card.col}
            initial={{ opacity: 0, y: card.yOffset + 40 }}
            whileInView={{ opacity: 1, y: card.yOffset }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {/* Head */}
            <div
              style={{
                background: '#EFE8DC',
                borderRadius: '28px',
                padding: '32px 30px 28px',
                marginBottom: 0,
              }}
            >
              <h4
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 400,
                  fontSize: '26px',
                  lineHeight: 1.15,
                  letterSpacing: '-0.015em',
                  color: '#1C1917',
                  minHeight: '64px',
                  whiteSpace: 'pre-line',
                }}
              >
                {card.headText}
              </h4>
            </div>

            {/* Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                borderRadius: '28px',
                padding: '28px 30px 30px',
                color: card.textColor,
                position: 'relative',
                overflow: 'hidden',
                minHeight: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                willChange: 'transform',
                background: card.bg,
                marginTop: '14px',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 500 }}>{card.label}</div>
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 400,
                  fontSize: '130px',
                  letterSpacing: '-0.045em',
                  lineHeight: 1,
                }}
              >
                {card.num}
              </div>

              {card.illu}

              {/* Arrow */}
              <svg
                style={{ position: 'absolute', bottom: '22px', right: '26px', width: '18px', height: '18px' }}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke={card.textColor}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
