'use client'

import { motion } from 'framer-motion'

interface TestimonialData {
  quote: string
  name: string
  role: string
}

const col1: TestimonialData[] = [
  {
    quote:
      "I'd been staring at derivatives for three weeks. One minute with Prologue's tangent-line visual and it finally clicked. It's the first time I actually understood something instead of just memorising a formula.",
    name: 'Aanya Sharma',
    role: 'Grade 10 Student, CBSE',
  },
  {
    quote:
      "I was nervous about AI in my classroom until I saw Prologue. It never gives students the answer — only the understanding. That's exactly what a good teacher does. It's the only AI tool I've recommended to my department.",
    name: 'Ms. Rebecca Torres',
    role: 'Math Teacher, Grade 7',
  },
]

const col2: TestimonialData[] = [
  {
    quote:
      "My teacher explained supply and demand five times. I dragged one slider in Prologue and understood it immediately. I went back and explored four more related concepts on my own just because it was fun.",
    name: 'Marcus Chen',
    role: 'Grade 11 Student, AP Economics',
  },
  {
    quote:
      "When parents ask about AI in our school, I show them Prologue. It's structurally incapable of academic dishonesty. That's not a feature — that's the architecture. Every district administrator needs to see this.",
    name: 'Dr. James Okonkwo',
    role: 'Academic Director',
  },
]

const col3: TestimonialData[] = [
  {
    quote:
      "The live gravity simulation during onboarding was my wow moment. I've explored 40+ concepts since then. It actually makes studying feel like something you choose to do, not something you have to.",
    name: 'Sofia Reyes',
    role: 'Grade 9 Student, Common Core',
  },
  {
    quote:
      "I used it all through AP Physics and Linear Algebra. The visuals adapt to my level, and the Q&A box answers questions about the specific thing I'm looking at without ever doing my homework for me.",
    name: 'Ethan Blackwell',
    role: 'Grade 12 Student, AP Track',
  },
]

function TestCard({ item, delay }: { item: TestimonialData; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
      style={{
        background: '#EFE8DC',
        borderRadius: '24px',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
      }}
    >
      <div
        style={{
          color: '#C0392B',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '36px',
          lineHeight: 1,
        }}
      >
        &ldquo;
      </div>
      <div style={{ fontSize: '16px', lineHeight: 1.5, color: '#1C1917' }}>{item.quote}</div>
      <div>
        <div style={{ fontSize: '17px', fontWeight: 500, color: '#1C1917' }}>{item.name}</div>
        <div style={{ fontSize: '14px', color: '#7C7570', marginTop: '2px' }}>{item.role}</div>
      </div>
    </motion.div>
  )
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      style={{ padding: '100px 80px 180px' }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Column 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {col1.map((item, i) => (
            <TestCard key={item.name} item={item} delay={i * 0.1} />
          ))}
        </div>

        {/* Column 2 — shifted down */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            marginTop: '80px',
          }}
        >
          {col2.map((item, i) => (
            <TestCard key={item.name} item={item} delay={0.15 + i * 0.1} />
          ))}
        </div>

        {/* Column 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {col3.map((item, i) => (
            <TestCard key={item.name} item={item} delay={0.3 + i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  )
}
