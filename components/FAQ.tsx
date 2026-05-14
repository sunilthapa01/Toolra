'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'How does Wollo handle social media advertising integration?',
    answer:
      'Wollo integrates with all major ad platforms to centralize campaign creation, budget management, and performance tracking in one dashboard.',
  },
  {
    question: 'Can I manage multiple social media accounts from a single dashboard with Wollo?',
    answer:
      'Yes. Connect unlimited accounts across every supported network and switch between them with a single click.',
  },
  {
    question: 'Is there a mobile app available for managing social media on the go with Wollo?',
    answer: 'Native iOS and Android apps let you publish, reply, and review analytics from anywhere.',
  },
  {
    question: 'How does Wollo ensure data security and privacy for user accounts?',
    answer:
      'End-to-end encryption, SOC 2 Type II compliance, and granular role-based access controls keep your data safe.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section style={{ padding: '80px 80px 120px' }}>
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
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
        Frequently Asked
      </motion.h2>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={i}
              style={{
                borderBottom: '1px solid #ececef',
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                style={{
                  width: '100%',
                  padding: '26px 4px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '24px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 400,
                    fontSize: '22px',
                    letterSpacing: '-0.01em',
                    color: '#0a0a0a',
                  }}
                >
                  {faq.question}
                </span>
                <motion.svg
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '14px', height: '14px', color: '#0a0a0a', flexShrink: 0 }}
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        padding: '0 4px 18px',
                        color: '#8a8a92',
                        fontSize: '15px',
                        lineHeight: 1.55,
                      }}
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}
