'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface FAQItem {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: 'How is Prologue different from asking ChatGPT to explain a concept?',
    answer:
      "ChatGPT gives you text. Prologue gives you a working environment you control. You can't truly understand a derivative by reading about it — you need to drag the point and feel the slope change. One is passive; the other is physical.",
  },
  {
    question: "Can students use Prologue to cheat on their homework?",
    answer:
      "No — and this is by design. Prologue never completes a student's work. It only illuminates the underlying concept. A student who understands what a derivative is still has to solve their calculus problem themselves. The platform is structurally incapable of academic dishonesty.",
  },
  {
    question: 'What subjects and grade levels does Prologue support?',
    answer:
      'Prologue supports Common Core (US), AP (Grades 11–13), CBSE (India), and General/International — for Grades 6 through 13. Subjects include Math, Physics, Chemistry, Biology, Economics, History, and more.',
  },
  {
    question: 'How does Prologue handle content safety for schools?',
    answer:
      'Every student input is classified by a fast AI moderation layer before any visual generation happens. Inappropriate requests are blocked and logged to an audit trail. When a district asks what happens if a student misuses the tool, you show them the log.',
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
        Frequently Asked Questions
      </motion.h2>

      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={i}
              style={{
                borderBottom: '1px solid #DDD5C6',
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
                    color: '#1C1917',
                  }}
                >
                  {faq.question}
                </span>
                <motion.svg
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: '14px', height: '14px', color: '#1C1917', flexShrink: 0 }}
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
                        color: '#7C7570',
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
