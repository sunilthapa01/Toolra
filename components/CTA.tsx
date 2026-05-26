'use client'

export default function CTA() {
  return (
    <section style={{ padding: '0 40px 40px' }}>
      <div
        style={{
          background: '#1C1917',
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
              maxWidth: '48%',
              marginBottom: '38px',
            }}
          >
            Understand Anything
            <br />
            By Exploring It
            <br />
            Yourself.
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
            Start for Free
          </a>
        </div>

        {/* Math Graph Illustration */}
        <div
          style={{
            position: 'absolute',
            right: '-2%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '52%',
            height: '115%',
          }}
        >
          <svg
            viewBox="0 0 620 520"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <defs>
              <pattern id="mathGrid" width="55" height="55" patternUnits="userSpaceOnUse">
                <path d="M 55 0 L 0 0 0 55" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              </pattern>
              {/* Fade mask so illustration softly clips on the left edge */}
              <linearGradient id="fadeLeft" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1C1917" stopOpacity="1" />
                <stop offset="18%" stopColor="#1C1917" stopOpacity="0" />
              </linearGradient>
              <mask id="leftFade">
                <rect width="620" height="520" fill="white" />
                <rect width="620" height="520" fill="url(#fadeLeft)" />
              </mask>
            </defs>

            <g mask="url(#leftFade)">
              {/* Grid */}
              <rect width="620" height="520" fill="url(#mathGrid)" />

              {/* ── Coordinate axes ── */}
              {/* X axis */}
              <line x1="0" y1="390" x2="604" y2="390" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
              <polygon points="602,386 614,390 602,394" fill="rgba(255,255,255,0.4)" />
              {/* Y axis */}
              <line x1="110" y1="520" x2="110" y2="16" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" />
              <polygon points="106,18 110,6 114,18" fill="rgba(255,255,255,0.4)" />

              {/* Axis labels */}
              <text x="608" y="395" fill="rgba(255,255,255,0.5)" fontSize="13" fontFamily="monospace" fontStyle="italic">x</text>
              <text x="116" y="12" fill="rgba(255,255,255,0.5)" fontSize="13" fontFamily="monospace" fontStyle="italic">y</text>

              {/* Tick marks — x axis */}
              {[55, 165, 220, 275, 330, 385, 440, 495, 550].map((x) => (
                <line key={x} x1={x} y1="386" x2={x} y2="394" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              ))}
              {/* Tick marks — y axis */}
              {[55, 110, 165, 220, 275, 330].map((y) => (
                <line key={y} x1="106" y1={y} x2="114" y2={y} stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              ))}

              {/* ── Two large circles centered at the roots ──
                  Root1 = (70, 390)   Root2 = (550, 390)
                  Vertex = (310, 80)
                  Radius ≈ dist(root, vertex) = sqrt(240²+310²) ≈ 393               */}
              <circle
                cx="70" cy="390" r="393"
                fill="none"
                stroke="rgba(192,57,43,0.52)"
                strokeWidth="1.4"
                strokeDasharray="9 5"
              />
              <circle
                cx="550" cy="390" r="393"
                fill="none"
                stroke="rgba(192,57,43,0.52)"
                strokeWidth="1.4"
                strokeDasharray="9 5"
              />

              {/* ── Parabola (quadratic bezier) ──
                  Through root1(70,390), vertex(310,80), root2(550,390)
                  Control point CP = (310, -230)                           */}
              <path
                d="M 70 390 Q 310 -230 550 390"
                fill="none"
                stroke="rgba(210,70,55,0.9)"
                strokeWidth="2.2"
              />

              {/* Dashed vertical drop from vertex to x-axis */}
              <line
                x1="310" y1="80" x2="310" y2="390"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth="1"
                strokeDasharray="5 4"
              />

              {/* Dashed horizontal from vertex to y-axis */}
              <line
                x1="110" y1="80" x2="310" y2="80"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth="1"
                strokeDasharray="5 4"
              />

              {/* ── Key points ── */}
              {/* Vertex */}
              <circle cx="310" cy="80" r="6" fill="#C0392B" />
              <circle cx="310" cy="80" r="3" fill="white" />
              {/* Root 1 */}
              <circle cx="70" cy="390" r="5.5" fill="#C0392B" />
              <circle cx="70" cy="390" r="2.5" fill="white" />
              {/* Root 2 */}
              <circle cx="550" cy="390" r="5.5" fill="#C0392B" />
              <circle cx="550" cy="390" r="2.5" fill="white" />
              {/* Vertex projection on x-axis */}
              <circle cx="310" cy="390" r="3.5" fill="rgba(255,255,255,0.45)" />
              {/* Vertex projection on y-axis */}
              <circle cx="110" cy="80" r="3.5" fill="rgba(255,255,255,0.3)" />

              {/* ── Labels ── */}
              <text
                x="320" y="74"
                fill="rgba(255,255,255,0.78)"
                fontSize="11"
                fontFamily="monospace"
                letterSpacing="1.5"
              >
                vertex
              </text>

              {/* Small arc label hints near roots */}
              <text x="38" y="382" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="monospace">x₁</text>
              <text x="554" y="382" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="monospace">x₂</text>

              {/* Subtle annotation lines from circle centres */}
              <line x1="70" y1="390" x2="310" y2="80" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
              <line x1="550" y1="390" x2="310" y2="80" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

              {/* Bottom tagline */}
              <text
                x="30" y="510"
                fill="rgba(255,255,255,0.2)"
                fontSize="9"
                fontFamily="monospace"
                letterSpacing="3"
              >
                SEE IT. TOUCH IT. UNDERSTAND IT.
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}
