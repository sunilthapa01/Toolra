'use client'

import { useEffect, useRef } from 'react'

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'History', 'Literature', 'Philosophy',
  'Art', 'Music', 'Economics', 'Computer Science',
  'Statistics', 'Psychology',
]

// Pairs of subject indices that are connected
const LINKS: [number, number][] = [
  [0, 1], [0, 2], [0, 9], [0, 10], [0, 11],
  [1, 2], [2, 3], [3, 12],
  [4, 5], [4, 6], [5, 6], [5, 7],
  [7, 8], [8, 12], [9, 11], [9, 12], [10, 11],
]

export default function HeroGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0
    let H = 0

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.scale(dpr, dpr)
    }
    setSize()
    window.addEventListener('resize', setSize)

    // Per-node static data
    const n = SUBJECTS.length
    const baseAngles = Array.from({ length: n }, (_, i) => (i / n) * Math.PI * 2 - Math.PI / 2)
    const phases = Array.from({ length: n }, () => Math.random() * Math.PI * 2)

    // One pulse per edge
    const pulses = LINKS.map(() => ({
      t: Math.random(),
      speed: 0.0032 + Math.random() * 0.003,
    }))

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    canvas.addEventListener('mousemove', onMouseMove)

    let t = 0

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      t += 0.005

      ctx.clearRect(0, 0, W, H)

      const cx = W * 0.5
      const cy = H * 0.5
      const baseR = Math.min(W, H) * 0.31

      // Compute current node positions
      const pts = baseAngles.map((baseAngle, i) => {
        const angle = baseAngle + t * 0.12
        const drift = Math.sin(t * 0.65 + phases[i]) * 11
        const r = baseR + drift
        const x = cx + Math.cos(angle) * r
        // Squashed Y creates perspective ellipse (looks like tilted 3-D ring)
        const y = cy + Math.sin(angle) * r * 0.52

        const dx = x - mouseRef.current.x
        const dy = y - mouseRef.current.y
        const glow = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 145)

        return { x, y, glow, label: SUBJECTS[i] }
      })

      // — Edges —
      LINKS.forEach(([ai, bi]) => {
        const a = pts[ai]
        const b = pts[bi]
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = 'rgba(255,255,255,0.07)'
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // — Pulses (light traveling along edges) —
      pulses.forEach((p, i) => {
        p.t = (p.t + p.speed) % 1
        const [ai, bi] = LINKS[i]
        const a = pts[ai]
        const b = pts[bi]
        const px = a.x + (b.x - a.x) * p.t
        const py = a.y + (b.y - a.y) * p.t

        const grad = ctx.createRadialGradient(px, py, 0, px, py, 13)
        grad.addColorStop(0, 'rgba(218,76,55,0.92)')
        grad.addColorStop(0.45, 'rgba(218,76,55,0.22)')
        grad.addColorStop(1, 'rgba(218,76,55,0)')
        ctx.beginPath()
        ctx.arc(px, py, 13, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        // Hard bright core
        ctx.beginPath()
        ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,210,195,1)'
        ctx.fill()
      })

      // — Nodes —
      pts.forEach(({ x, y, glow, label }) => {
        // Ambient halo (always visible, grows with mouse proximity)
        const haloR = 16 + glow * 30
        const halo = ctx.createRadialGradient(x, y, 0, x, y, haloR)
        halo.addColorStop(0, `rgba(192,57,43,${0.18 + glow * 0.5})`)
        halo.addColorStop(1, 'rgba(192,57,43,0)')
        ctx.beginPath()
        ctx.arc(x, y, haloR, 0, Math.PI * 2)
        ctx.fillStyle = halo
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${0.68 + glow * 0.32})`
        ctx.fill()

        // Red ring
        ctx.beginPath()
        ctx.arc(x, y, 7.5, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(192,57,43,${0.28 + glow * 0.72})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Label (appears fully on hover, ghost otherwise)
        ctx.textAlign = 'center'
        ctx.font = '9px monospace'
        ctx.fillStyle = `rgba(255,255,255,${0.32 + glow * 0.68})`
        ctx.fillText(label, x, y + 22)
      })
    }

    animate()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', setSize)
      canvas.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  )
}
