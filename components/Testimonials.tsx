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
      "Wollo has transformed our social media team's efficiency. With streamlined scheduling and seamless performance tracking, our engagement has soared, resulting in a significant traffic increase. Highly recommend!",
    name: 'Caleb Whitmore',
    role: 'Team Lead',
  },
  {
    quote:
      "Since implementing Wollo, our social media strategies have reached new heights of efficiency and effectiveness. I've witnessed firsthand the impact of this powerful tool on our campaigns.",
    name: 'Zephyr Finnegan',
    role: 'Marketing Operations',
  },
]

const col2: TestimonialData[] = [
  {
    quote:
      "Initially skeptical, I'm thrilled with Wollo's SMM features. They've boosted our social media presence. The responsive support team ensures any queries are swiftly addressed.",
    name: 'Elodie Harrington',
    role: 'Brand Manager',
  },
  {
    quote:
      "Of all the SMM management tools I've tried, this one stands out. Its intuitive interface and real-time analytics have elevated my social media strategy. It becomes an indispensable asset to my business.",
    name: 'Azura Everly',
    role: 'Content Strategist',
  },
]

const col3: TestimonialData[] = [
  {
    quote:
      "This affordable SMM management tool has revolutionized my small business's social media management. Its scheduling capabilities have saved me time, while analytics help me refine content.",
    name: 'Xavier Sinclair',
    role: 'Customer Strategist',
  },
  {
    quote:
      'Wollo has become an indispensable asset for our social media team. Its user-friendly interface and comprehensive analytics help us to craft compelling brand narratives and optimize audience engagement.',
    name: 'Caspian Hawthorne',
    role: 'SMM Manager',
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
        background: '#f5f5f7',
        borderRadius: '24px',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
      }}
    >
      <div
        style={{
          color: '#5b3cff',
          fontFamily: "'Outfit', sans-serif",
          fontSize: '36px',
          lineHeight: 1,
        }}
      >
        &ldquo;
      </div>
      <div style={{ fontSize: '16px', lineHeight: 1.5, color: '#0a0a0a' }}>{item.quote}</div>
      <div>
        <div style={{ fontSize: '17px', fontWeight: 500, color: '#0a0a0a' }}>{item.name}</div>
        <div style={{ fontSize: '14px', color: '#8a8a92', marginTop: '2px' }}>{item.role}</div>
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
