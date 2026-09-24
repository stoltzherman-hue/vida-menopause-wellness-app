'use client'
import { useState } from 'react'

const FAQS = [
  {
    q: 'What is perimenopause and how is it different from menopause?',
    a: 'Perimenopause is the transitional phase before menopause — it can begin 4–10 years before your final period, often starting in your early 40s. During this time, oestrogen and progesterone fluctuate unpredictably, causing many of the symptoms women associate with "going through menopause." Menopause itself is defined as 12 consecutive months without a period. The most intense symptoms often occur during perimenopause, not after.',
  },
  {
    q: 'What are the most common symptoms I should be tracking?',
    a: 'The most commonly reported symptoms include hot flushes, night sweats, sleep disruption, brain fog, mood changes (anxiety, low mood, irritability), joint pain, fatigue, vaginal dryness, and changes in libido. However, everyone\'s experience is different — which is exactly why tracking your specific patterns is so valuable. Your data will reveal which symptoms are most impactful for you.',
  },
  {
    q: 'How do I know if my symptoms are perimenopause or something else?',
    a: 'Many symptoms of perimenopause overlap with other conditions like thyroid issues, iron-deficiency anaemia, and depression. The best approach is to track your symptoms over time and share the pattern with your GP. Vida\'s daily check-in builds exactly this kind of evidence — a clear symptom history that helps your doctor see the full picture rather than a single data point.',
  },
  {
    q: 'Is HRT (hormone replacement therapy) safe?',
    a: 'For many people with menopause symptoms, the benefits of HRT may outweigh the risks, but the balance depends on age, symptoms, medical history, formulation and route. This is a conversation to have with a qualified healthcare professional. Vida can help you prepare a clear symptom summary for that appointment.',
  },
  {
    q: 'Can lifestyle changes actually help with menopause symptoms?',
    a: 'Lifestyle changes can support general health and may help some symptoms, but responses differ. Regular movement supports bone, heart and mental health; reducing personal triggers such as alcohol or caffeine may help some people; and sleep routines can support rest. Tracking helps you notice what changes coincide with improvement for you.',
  },
  {
    q: 'How long does menopause last?',
    a: 'The menopause transition and its symptoms vary widely. Perimenopause can last several years, and some symptoms continue after the final period. There is no single timeline that applies to everyone, so seek healthcare advice if symptoms are persistent, severe or affecting daily life.',
  },
  {
    q: 'Is it normal to feel anxious and low during menopause?',
    a: 'Mood changes, anxiety, irritability and difficulty concentrating are reported during the menopause transition. They can also have other causes, and depression or severe anxiety deserves proper assessment and support. These symptoms are not a reflection of personal weakness.',
  },
  {
    q: 'Will I gain weight during menopause?',
    a: 'Weight distribution often shifts during menopause — particularly toward the abdomen — due to changing oestrogen levels affecting fat storage. However, total weight gain is more strongly associated with age-related metabolic changes and lifestyle factors than menopause itself. Strength training and adequate protein intake are the most evidence-backed approaches to managing this shift. Tracking energy levels and sleep quality in Vida can help you understand what\'s affecting your activity.',
  },
  {
    q: 'What is Vida and how does it help?',
    a: 'Vida is a menopause and perimenopause wellness companion that combines daily symptom tracking, pattern insights, an AI wellness coach, and a supportive community — all in one place. The daily check-in takes under 2 minutes. Over time, Vida builds a personal picture of your symptoms, triggers, and what helps — giving you the clarity to make better decisions and have better conversations with your healthcare provider.',
  },
]

export function MarketingFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  function toggle(i: number) {
    setOpen(open === i ? null : i)
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      {FAQS.map((faq, i) => (
        <div
          key={i}
          className={`faq-item${open === i ? ' faq-open' : ''}`}
        >
          <button
            className="faq-btn"
            onClick={() => toggle(i)}
            aria-expanded={open === i}
          >
            <span>{faq.q}</span>
            <svg
              className="faq-chevron"
              width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
          <div className="faq-body">
            <p className="faq-answer">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
