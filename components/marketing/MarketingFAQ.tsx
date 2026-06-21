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
    a: 'Current evidence from large-scale studies suggests that for most healthy women under 60 who are within 10 years of their last period, the benefits of HRT outweigh the risks. The picture is more nuanced for some health histories. This is a conversation to have with your GP or menopause specialist, ideally armed with your symptom data. Vida can help you prepare a clear summary for that appointment.',
  },
  {
    q: 'Can lifestyle changes actually help with menopause symptoms?',
    a: 'Yes, meaningfully so. Evidence supports: regular weight-bearing exercise (reduces hot flush frequency and supports bone density), reducing alcohol and caffeine (both can trigger hot flushes and disrupt sleep), a diet rich in phytoestrogens (soy, flaxseed, legumes), stress reduction (the nervous system directly affects how the body responds to hormonal shifts), and prioritising sleep hygiene. Tracking which changes help is where Vida adds the most value.',
  },
  {
    q: 'How long does menopause last?',
    a: 'The entire transition — perimenopause through the post-menopausal settling period — typically spans 7–14 years, though the most symptomatic phase is usually 2–5 years around your final period. Symptoms often ease significantly by 2–3 years after your last period, though some women (particularly with hot flushes) experience symptoms for longer. Post-menopause brings its own health considerations, especially around bone and heart health.',
  },
  {
    q: 'Is it normal to feel anxious and low during menopause?',
    a: 'Extremely common — and vastly under-recognised. Oestrogen plays a role in serotonin regulation, so its fluctuation can directly affect mood. Many women experience their first episodes of anxiety or depression during perimenopause, even with no prior history. Brain fog, irritability, and emotional sensitivity are also widely reported. Importantly, these are hormonal responses — not a reflection of your mental strength or character.',
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
