'use client'

export default function CTA() {
  return (
    <section style={{ padding: '0 40px 40px' }}>
      <div
        style={{
          background: '#7464ff',
          borderRadius: '36px',
          overflow: 'hidden',
          position: 'relative',
          minHeight: '480px',
          padding: '80px 80px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(40px, 5.4vw, 76px)',
              lineHeight: 1.05,
              color: '#fff',
              letterSpacing: '-0.025em',
              maxWidth: '60%',
              marginBottom: '38px',
            }}
          >
            Reach More People
            <br />
            and Grow Your Brand
            <br />
            Awareness.
          </h2>
          <a
            href="#"
            style={{
              padding: '14px 36px',
              borderRadius: '999px',
              fontFamily: 'inherit',
              fontSize: '15px',
              fontWeight: 400,
              cursor: 'pointer',
              border: '1.5px solid rgba(255,255,255,0.85)',
              background: 'transparent',
              color: '#fff',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'transform 0.2s, opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Start Free Trial
          </a>
        </div>

        {/* Illustration */}
        <div
          style={{
            position: 'absolute',
            right: '-2%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '46%',
            height: '110%',
          }}
        >
          <svg
            viewBox="0 0 600 500"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <defs>
              <linearGradient id="ctaCubeG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a098ff" />
                <stop offset="100%" stopColor="#5b3cff" />
              </linearGradient>
            </defs>
            <ellipse cx="320" cy="430" rx="180" ry="20" fill="rgba(0,0,0,0.18)" />
            {/* rings */}
            <ellipse
              cx="320"
              cy="250"
              rx="170"
              ry="50"
              fill="none"
              stroke="#3826c6"
              strokeWidth="22"
              transform="rotate(-20 320 250)"
            />
            <ellipse
              cx="320"
              cy="250"
              rx="170"
              ry="50"
              fill="none"
              stroke="#5b4eff"
              strokeWidth="22"
              transform="rotate(40 320 250)"
            />
            {/* cube */}
            <rect x="240" y="170" width="170" height="170" rx="14" fill="url(#ctaCubeG)" />
            <rect x="270" y="200" width="50" height="50" rx="6" fill="#fbd838" />
            <path d="M 290 210 L 305 240 L 320 210 Z" fill="#ff7733" />
            <rect x="340" y="240" width="40" height="60" rx="4" fill="#ff5ca8" />
            <circle cx="320" cy="290" r="14" fill="#fbd838" />
            {/* pencil */}
            <g transform="rotate(28 470 160)">
              <rect x="440" y="80" width="20" height="160" fill="#5b3cff" />
              <path d="M 440 80 L 460 80 L 450 60 Z" fill="#fbd838" />
              <rect x="440" y="240" width="20" height="14" fill="#ff7733" />
            </g>
            {/* yellow dot */}
            <circle cx="380" cy="100" r="10" fill="#fbd838" />
          </svg>
        </div>
      </div>
    </section>
  )
}
