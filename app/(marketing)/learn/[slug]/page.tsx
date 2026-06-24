import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

const ARTICLES = [
  {
    slug: 'what-is-perimenopause',
    category: 'Understanding',
    title: 'What is perimenopause? The complete guide',
    readTime: 8,
    icon: 'P',
    color: '#9b7cc8',
    bg: 'rgba(255,255,255,0.04)',
    intro: 'Perimenopause can begin a decade before your last period — and for many women, it starts in their early 40s, sometimes even late 30s. Yet it often goes unrecognised for years. Here\'s what\'s actually happening hormonally, what to expect, and when to seek support.',
    sections: [
      { heading: 'What is perimenopause?', body: 'Perimenopause is the transitional phase leading up to menopause — the point at which you\'ve gone 12 consecutive months without a period. During perimenopause, your ovaries gradually produce less oestrogen and progesterone. This process is rarely smooth or linear. Hormone levels fluctuate unpredictably, which is why symptoms can feel inconsistent and confusing.' },
      { heading: 'When does it start?', body: 'Most women enter perimenopause in their mid-to-late 40s, but it can begin as early as the mid-30s. On average it lasts 4–8 years, though this varies considerably. You may not even notice it beginning — the earliest signs are often subtle changes in your menstrual cycle.' },
      { heading: 'What causes the symptoms?', body: 'Oestrogen receptors exist throughout the body — in the brain, bones, cardiovascular system, skin, bladder, and vagina. As oestrogen fluctuates and eventually declines, all of these systems are affected. This is why the symptom list is so long and varied, and why menopause is a whole-body experience rather than just a "reproductive" one.' },
      { heading: 'How is it diagnosed?', body: 'Perimenopause is typically a clinical diagnosis based on age, symptoms, and changes to your menstrual cycle. Blood tests (FSH, oestradiol) can be helpful but are often unreliable in perimenopause because hormone levels fluctuate significantly day to day. A single normal result doesn\'t rule it out.' },
      { heading: 'What should I do if I think I\'m in perimenopause?', body: 'Start tracking. Keeping a record of your symptoms — their frequency, severity, and any patterns — is genuinely useful. It helps you understand what\'s happening, identify triggers, and gives your doctor the information they need to support you. Vida is designed to make this easy.' },
    ],
  },
  {
    slug: 'hot-flushes-night-sweats',
    category: 'Symptoms',
    title: 'Hot flushes and night sweats: what\'s happening and what helps',
    readTime: 6,
    icon: 'H',
    color: '#c4b8e0',
    bg: 'rgba(255,255,255,0.04)',
    intro: 'Around 75% of women experience hot flushes during menopause. They\'re one of the most disruptive symptoms — affecting sleep, concentration, and confidence. Understanding what triggers them, and what the options are, can make a real difference.',
    sections: [
      { heading: 'What causes hot flushes?', body: 'Hot flushes are caused by oestrogen\'s effect on the hypothalamus — the brain\'s temperature-regulation centre. As oestrogen declines, the hypothalamus becomes more sensitive to small changes in body temperature, triggering inappropriate cooling responses: blood vessels dilate, you sweat, your heart rate rises. A flush typically lasts 2–4 minutes.' },
      { heading: 'Common triggers', body: 'Triggers vary between women, but commonly include: alcohol (particularly wine), caffeine, spicy food, hot drinks, stress, a warm room, synthetic clothing, and vigorous exercise. Tracking helps you identify your personal triggers — the pattern often isn\'t obvious in the moment but becomes clear over weeks.' },
      { heading: 'What actually helps?', body: 'Lifestyle: CBT-based techniques (especially paced breathing — slow, diaphragmatic breathing at 6–8 breaths per minute) have the strongest evidence for non-hormonal management, reducing flush frequency and distress. Studies show paced breathing can reduce hot flush severity by up to 50%. Cooling strategies, avoiding triggers, and loose natural-fibre clothing also help.\n\nHRT: Hormone replacement therapy is the most effective treatment for vasomotor symptoms, reducing flushes by 75–90%. Modern evidence shows it is safe for most women when started within 10 years of menopause.\n\nNon-hormonal medication: SSRIs, SNRIs, gabapentin, and oxybutynin have evidence as alternatives when HRT isn\'t suitable.' },
      { heading: 'Night sweats', body: 'Night sweats are simply hot flushes that occur during sleep — but the sleep disruption they cause compounds fatigue, mood, and cognitive function, making everything harder. Cooling the bedroom to 16–18°C, breathable bedding, and keeping a cold drink by the bed can help. HRT typically resolves night sweats within weeks.' },
    ],
  },
  {
    slug: 'menopause-brain-fog',
    category: 'Symptoms',
    title: 'Menopause and brain fog: what\'s actually happening',
    readTime: 5,
    icon: 'B',
    color: '#9b7cc8',
    bg: 'rgba(255,255,255,0.04)',
    intro: 'Forgetting words mid-sentence, losing your train of thought, walking into rooms with no idea why — brain fog is one of the most distressing menopause symptoms, yet it\'s rarely acknowledged. It\'s real, it\'s common, and it\'s hormonal.',
    sections: [
      { heading: 'Why does menopause affect thinking?', body: 'Oestrogen plays an active role in brain function, including verbal memory, processing speed, and attention. There are oestrogen receptors throughout the brain, particularly in the hippocampus (the memory centre). As oestrogen fluctuates and declines, these cognitive functions can be temporarily impaired.' },
      { heading: 'What does the research say?', body: 'Studies show that women in perimenopause and the early years of post-menopause score lower on objective cognitive tests than they did before. Crucially, this appears to be transitional — for most women, cognitive function stabilises and often returns to baseline in the years after menopause.' },
      { heading: 'What makes it worse?', body: 'Sleep deprivation compounds brain fog significantly — if you\'re also experiencing night sweats, the cognitive impact is layered. Anxiety, stress, depression, and thyroid issues (which can co-occur with menopause) all affect thinking clarity. Ruling out other causes is worth doing.' },
      { heading: 'What helps?', body: 'HRT has evidence for improving verbal memory and reducing brain fog for many women. Prioritising sleep quality is critical. Regular aerobic exercise, managing stress, limiting alcohol, and maintaining social and cognitive engagement all support brain health. If you\'re worried about cognitive decline rather than fog, speak to your GP — dementia has different hallmarks.' },
    ],
  },
  {
    slug: 'sleep-and-menopause',
    category: 'Symptoms',
    title: 'Sleep and menopause: why it changes and what actually helps',
    readTime: 7,
    icon: 'S',
    color: '#c4b8e0',
    bg: 'rgba(255,255,255,0.04)',
    intro: 'Poor sleep during menopause isn\'t just about night sweats. Multiple mechanisms converge to disrupt sleep — and understanding which ones affect you most is the first step to addressing them.',
    sections: [
      { heading: 'Why sleep changes in menopause', body: 'Several mechanisms are at work: night sweats wake you repeatedly; declining progesterone (which has sedative properties) makes it harder to fall and stay asleep; oestrogen changes affect sleep architecture; anxiety and mood changes make the mind race at night; and the circadian rhythm itself shifts.' },
      { heading: 'Sleep hygiene — the basics that actually matter', body: 'Consistent sleep and wake times (including weekends) are the most powerful sleep-hygiene tool. Keep the bedroom cool (16–18°C), dark, and quiet. Avoid screens for 30–60 minutes before bed. Reduce alcohol — it may help you fall asleep but significantly disrupts sleep quality in the second half of the night.' },
      { heading: 'CBT for insomnia (CBT-I)', body: 'CBT-I is the gold-standard treatment for chronic insomnia and has strong evidence for menopausal sleep problems. It addresses the thoughts and behaviours that perpetuate poor sleep — including sleep anxiety, unhelpful compensatory habits, and irregular schedules. It outperforms sleeping tablets in the long term.' },
      { heading: 'HRT and sleep', body: 'If night sweats or vasomotor symptoms are the primary cause, HRT is highly effective at restoring sleep. Many women report dramatic improvement in sleep quality within weeks of starting treatment.' },
      { heading: 'Tracking your sleep', body: 'Logging sleep quality and duration alongside symptoms in Vida can reveal patterns — which nights are worst, what happened the day before, whether triggers like alcohol or a stressful day made a difference. Pattern awareness is genuinely useful before and during treatment.' },
    ],
  },
  {
    slug: 'mood-anxiety-menopause',
    category: 'Mental health',
    title: 'The mood rollercoaster: anxiety, low mood and irritability in menopause',
    readTime: 6,
    icon: 'M',
    color: '#9b7cc8',
    bg: 'rgba(255,255,255,0.04)',
    intro: 'Mood changes during perimenopause and menopause are hormonal — not a sign that something is wrong with you. Understanding the mechanism helps it feel less terrifying, and know that it is treatable.',
    sections: [
      { heading: 'The hormone-mood connection', body: 'Oestrogen plays a direct role in regulating serotonin and other neurotransmitters. When oestrogen fluctuates unpredictably — as it does in perimenopause — mood can follow. This creates low mood, irritability, anxiety, and emotional volatility that many women describe as "not like themselves."' },
      { heading: 'Is it depression or perimenopause?', body: 'Distinguishing between them matters for treatment. Perimenopausal mood changes often track with hormonal fluctuations — worse at certain points in the cycle, variable from week to week. They\'re frequently accompanied by other physical symptoms (flushes, sleep disruption, brain fog). Clinical depression can also occur or co-exist. Speak to your GP about your full picture.' },
      { heading: 'Anxiety', body: 'New or worsening anxiety is one of the most common and least-recognised menopausal symptoms. It can present as generalised anxiety, health anxiety, panic attacks, or a persistent background sense of dread. It is frequently dismissed or misdiagnosed. If you\'ve never had anxiety before and it begins in your 40s or 50s, it is likely hormonal.' },
      { heading: 'What helps', body: 'HRT can be highly effective for mood symptoms driven by oestrogen fluctuation — often working faster than antidepressants and without the same side effects. CBT is effective for anxiety and low mood and can be combined with HRT. Regular exercise has a meaningful evidence base for mood. Prioritising sleep is essential, as sleep deprivation amplifies emotional reactivity significantly.' },
    ],
  },
  {
    slug: 'exercise-menopause',
    category: 'Lifestyle',
    title: 'Exercise during menopause: what the evidence says',
    readTime: 5,
    icon: 'E',
    color: '#c4b8e0',
    bg: 'rgba(255,255,255,0.04)',
    intro: 'Exercise is one of the most powerful tools available during menopause — but different types of movement help with different symptoms. Here\'s what the evidence actually supports.',
    sections: [
      { heading: 'Strength training', body: 'Resistance training is arguably the most important form of exercise during and after menopause. It counteracts the muscle mass loss that accelerates with oestrogen decline, protects bone density, improves insulin sensitivity, supports healthy weight, and has meaningful evidence for improving mood. Aim for 2–3 sessions per week.' },
      { heading: 'Aerobic exercise', body: 'Cardiovascular exercise benefits heart health (increasingly important post-menopause), improves sleep, reduces anxiety, and supports mood. Walking, swimming, cycling, and dance all count. Moderate intensity for 150 minutes per week is the evidence-based target.' },
      { heading: 'Yoga and mind-body exercise', body: 'Yoga and tai chi have evidence for reducing hot flush severity, improving sleep, and reducing anxiety. They also support joint health and flexibility, which is relevant as oestrogen decline affects connective tissue. Mind-body practices specifically benefit the stress and mood dimensions of menopause.' },
      { heading: 'Pelvic floor exercise', body: 'Declining oestrogen affects the urogenital tissues, increasing risk of urinary leakage and pelvic floor dysfunction. Pelvic floor exercises (Kegels) help significantly and are often overlooked. A pelvic health physiotherapist can assess and guide you.' },
      { heading: 'Starting if you\'re not currently active', body: 'Starting is the hardest part. Short walks consistently are better than heroic sessions rarely. The goal is building a sustainable habit, not a performance. Tracking your activity alongside your symptoms in Vida often reveals the positive impact of movement on mood, sleep, and energy within a few weeks — which is highly motivating.' },
    ],
  },
  {
    slug: 'nutrition-menopause',
    category: 'Lifestyle',
    title: 'Nutrition and menopause: foods that support you',
    readTime: 7,
    icon: 'N',
    color: '#9b7cc8',
    bg: 'rgba(255,255,255,0.04)',
    intro: 'Nutrition during menopause is an area full of noise and marketing. Here\'s what the research actually supports — and what to be cautious about.',
    sections: [
      { heading: 'Calcium and bone health', body: 'Bone density loss accelerates in the perimenopause and post-menopause. Calcium from food (dairy, fortified plant milks, leafy greens, tinned fish with bones) supports bone density. The UK recommendation is 700mg/day, rising to 1200mg in post-menopause. Vitamin D (needed to absorb calcium) is deficient in many women — supplementation is widely recommended.' },
      { heading: 'Phytoestrogens', body: 'Phytoestrogens are plant compounds with mild oestrogen-like activity. Soya (tofu, edamame, miso), flaxseeds, and chickpeas are good sources. Evidence suggests they may modestly reduce hot flush frequency in some women. They are not a replacement for HRT but may provide a small benefit for those who can\'t or prefer not to use hormonal treatment.' },
      { heading: 'Omega-3 fatty acids', body: 'Oily fish (salmon, mackerel, sardines) 2–3 times a week supports heart and brain health — both increasingly relevant post-menopause. Omega-3s also have evidence for supporting mood and reducing inflammation.' },
      { heading: 'Blood sugar balance', body: 'Fluctuating blood sugar can worsen energy crashes, mood, and brain fog. Reducing ultra-processed foods, eating protein at each meal, and not skipping meals all support more stable blood sugar. This is not about restriction — it\'s about consistent fuelling.' },
      { heading: 'Alcohol', body: 'Alcohol is a well-documented hot flush trigger for many women, and it disrupts sleep quality significantly, worsening fatigue, brain fog, and mood. Reducing intake — even slightly — is one of the highest-impact nutrition changes many women can make.' },
      { heading: 'What to be cautious about', body: 'Supplements marketed specifically for menopause are often poorly evidenced and expensive. Black cohosh has some evidence for hot flushes but is not well-regulated. Evening primrose oil lacks good evidence. Always discuss supplements with your GP, especially if you\'re on medication.' },
    ],
  },
  {
    slug: 'talking-to-your-doctor',
    category: 'Treatment',
    title: 'How to talk to your doctor about menopause (and actually be heard)',
    readTime: 6,
    icon: 'T',
    color: '#c4b8e0',
    bg: 'rgba(255,255,255,0.04)',
    intro: 'Many women leave GP appointments feeling dismissed, unheard, or with no clear plan. It doesn\'t have to be this way. Preparation makes a significant difference.',
    sections: [
      { heading: 'Why appointments go wrong', body: 'GP appointments are short (typically 10 minutes), and menopause presents with a wide range of symptoms that individually could have other causes. Without a clear picture, doctors often address one symptom at a time. Many women also downplay their symptoms or expect to be asked more questions than they are.' },
      { heading: 'Prepare a symptom summary', body: 'The single most effective thing you can do is arrive with a written summary of your symptoms: what you experience, how often, how severely, and how much it impacts your life. Vida\'s Doctor Report feature generates this automatically from your check-in data. A concrete record changes the conversation.' },
      { heading: 'Be specific about impact', body: 'Doctors respond better to functional impact than symptom lists. "I haven\'t slept properly in 3 months and I can\'t do my job properly" is more actionable than "I\'m tired." Be honest about the scale of impact on your daily life, relationships, and work.' },
      { heading: 'Know what to ask for', body: 'You have the right to request HRT if you want to try it (and have no contraindications). You can ask for a referral to a menopause specialist if you\'re not getting the support you need. Menopause UK has a list of specialist menopause clinics. You can see a different GP if yours isn\'t helpful.' },
      { heading: 'Questions to bring', body: '"Could these symptoms be related to perimenopause or menopause?"\n"What are my options — hormonal and non-hormonal?"\n"What are the risks and benefits of HRT for someone like me?"\n"Can you refer me to a menopause specialist?"\n"What should I monitor, and when should I come back?"' },
    ],
  },
  {
    slug: 'hrt-common-questions',
    category: 'Treatment',
    title: 'HRT: the most common questions, answered clearly',
    readTime: 9,
    icon: 'H',
    color: '#9b7cc8',
    bg: 'rgba(255,255,255,0.04)',
    intro: 'The evidence on hormone replacement therapy has changed significantly in the last two decades. Many women are making decisions based on outdated information. Here\'s what we know now.',
    sections: [
      { heading: 'Is HRT safe?', body: 'For most women under 60 who are within 10 years of menopause onset, the benefits of HRT outweigh the risks. The 2002 Women\'s Health Initiative study that caused widespread concern has since been substantially reinterpreted — the population studied was older, and many risks applied specifically to oral oestrogen combined with synthetic progestogen.' },
      { heading: 'What are the actual risks?', body: 'Modern body-identical HRT (oestrogen applied as a gel, patch or spray; micronised progesterone for women with a uterus) has a very low risk profile. There is a small increased risk of breast cancer associated with combined HRT (oestrogen + progesterone) — comparable to the risk of drinking 1–2 units of alcohol per day or being overweight. This risk reduces significantly after stopping.' },
      { heading: 'Types of HRT', body: 'Oestrogen-only HRT: for women who have had a hysterectomy.\nCombined HRT (oestrogen + progesterone): for women with a uterus — progesterone protects the uterine lining.\nLocal oestrogen: applied vaginally as a cream, pessary, or ring — for urogenital symptoms only, with minimal systemic absorption and a very safe profile.\nTransdermal vs oral: patches, gels, and sprays deliver oestrogen through the skin, avoiding first-pass liver metabolism. This lowers VTE (blood clot) risk compared to oral tablets.' },
      { heading: 'How long can you take it?', body: 'There is no fixed time limit. Current guidance suggests reviewing annually and continuing for as long as the benefits outweigh the risks. Many women benefit from longer-term use, particularly for bone and heart protection. The old advice to stop after 5 years is not supported by current evidence for most women.' },
      { heading: 'If HRT isn\'t right for you', body: 'Some women can\'t take or prefer not to take HRT — due to certain types of breast cancer, uncontrolled migraines with aura, or personal preference. Non-hormonal options include: SSRIs/SNRIs, gabapentin, clonidine, fezolinetant (a new non-hormonal medication specifically for hot flushes), and CBT-based approaches.' },
    ],
  },
  {
    slug: 'bone-health-menopause',
    category: 'Understanding',
    title: 'Bone health and menopause: what you need to know',
    readTime: 5,
    icon: 'B',
    color: '#c4b8e0',
    bg: 'rgba(255,255,255,0.04)',
    intro: 'Bone density loss accelerates dramatically in the years around menopause. The good news: there is a lot you can do, and it\'s never too early — or too late — to start.',
    sections: [
      { heading: 'Why menopause affects bones', body: 'Oestrogen plays a key role in regulating bone turnover — the constant process of breaking down and rebuilding bone tissue. As oestrogen declines, bone loss speeds up. Women can lose 10–15% of their bone density in the first 5 years after menopause. This is why osteoporosis is significantly more common in women than men.' },
      { heading: 'Risk factors', body: 'Family history, early menopause (before 45), surgical menopause, smoking, low body weight, low calcium or vitamin D intake, high alcohol intake, and certain medications (including long-term steroids) all increase risk. If you have multiple risk factors, speak to your GP about a DEXA scan.' },
      { heading: 'What you can do', body: 'Strength training 2–3 times per week is the highest-impact intervention for bone density — it stimulates the bone-building process. Weight-bearing aerobic exercise (walking, jogging, dancing) also helps.\n\nCalcium from food (dairy, fortified plant milks, leafy greens, tinned sardines) and vitamin D supplementation are widely recommended. Avoiding smoking and excessive alcohol matters significantly.\n\nHRT is highly protective of bone density and substantially reduces fracture risk. It\'s often overlooked as a bone-health tool.' },
    ],
  },
  {
    slug: 'vaginal-health-menopause',
    category: 'Symptoms',
    title: 'Vaginal and sexual health during menopause',
    readTime: 5,
    icon: 'V',
    color: '#9b7cc8',
    bg: 'rgba(255,255,255,0.04)',
    intro: 'Genitourinary syndrome of menopause (GSM) — which includes vaginal dryness, discomfort during sex, and urinary symptoms — affects more than half of women after menopause. Unlike hot flushes, it rarely improves on its own. But it is very treatable.',
    sections: [
      { heading: 'What is GSM?', body: 'As oestrogen declines, the tissues of the vagina, vulva, and bladder thin and lose moisture. This causes symptoms ranging from mild dryness and discomfort to significant pain during sex, urinary urgency, recurrent UTIs, and reduced sensation. Many women don\'t mention it to their doctor because they assume it\'s inevitable.' },
      { heading: 'It won\'t improve without treatment', body: 'Unlike vasomotor symptoms (hot flushes) which often reduce over time, GSM is a chronic condition that tends to worsen without treatment. Seeking help early matters.' },
      { heading: 'Treatment options', body: 'Local oestrogen: the most effective treatment — available as a cream, pessary, or ring applied directly to vaginal tissue. It has minimal systemic absorption and is safe for almost all women, including those who can\'t take systemic HRT. It is a standing treatment, used indefinitely.\n\nNon-hormonal: vaginal moisturisers (used regularly, not just before sex) and lubricants (used during sex) provide symptom relief. They\'re available over the counter and should be the foundation of management.\n\nOspemifene: an oral medication for women who prefer not to use topical treatment.' },
      { heading: 'Sexual health', body: 'Reduced libido is common in menopause, influenced by both hormonal changes (declining testosterone as well as oestrogen) and the practical impact of pain, dryness, and fatigue. It is worth discussing directly with your GP. Testosterone supplementation is sometimes prescribed and has evidence for improving libido in menopause.' },
    ],
  },
  {
    slug: 'heart-health-menopause',
    category: 'Understanding',
    title: 'Heart health and menopause: the link women aren\'t told about',
    readTime: 6,
    icon: 'H',
    color: '#c4b8e0',
    bg: 'rgba(255,255,255,0.04)',
    intro: 'Cardiovascular disease is the leading cause of death in women over 50 — yet heart disease is often perceived as a male problem. Menopause changes heart disease risk significantly, and most women aren\'t told.',
    sections: [
      { heading: 'How oestrogen protects the heart', body: 'Oestrogen has multiple cardiovascular benefits: it supports healthy cholesterol levels (raising HDL, lowering LDL), helps maintain flexible blood vessels, reduces inflammation, and supports healthy blood pressure. After menopause, these protective effects are lost.' },
      { heading: 'Risk changes post-menopause', body: 'In the years after menopause, LDL cholesterol typically rises, blood pressure often increases, and body fat distribution shifts toward the abdomen — all cardiovascular risk factors. Women\'s heart disease risk catches up with men\'s over the decade following menopause.' },
      { heading: 'Symptoms to know', body: 'Women\'s heart attack symptoms often differ from the textbook "crushing chest pain." They may include: jaw or back pain, nausea, breathlessness, fatigue, and a vague feeling of unease. These are sometimes dismissed — including by healthcare providers. Know your risk factors and take symptoms seriously.' },
      { heading: 'What reduces risk', body: 'Regular aerobic exercise, not smoking, managing blood pressure and cholesterol, maintaining a healthy weight, limiting alcohol, and managing stress all reduce cardiovascular risk.\n\nHRT, when started early in menopause (within 10 years of the last period), may have a cardioprotective effect — this is an active area of research. It is not recommended solely for heart protection, but it does not increase heart disease risk in women who start it early.' },
    ],
  },
]

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = ARTICLES.find(a => a.slug === slug)
  if (!article) return { title: 'Not Found · Vida' }
  return {
    title: `${article.title} · Vida`,
    description: article.intro.slice(0, 155),
  }
}

export function generateStaticParams() {
  return ARTICLES.map(a => ({ slug: a.slug }))
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = ARTICLES.find(a => a.slug === slug)
  if (!article) notFound()

  const related = ARTICLES.filter(a => a.slug !== slug && (a.category === article.category)).slice(0, 3)

  return (
    <div style={{ minHeight: '100vh', background: '#09070e', fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>

      {/* Nav */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(24px)' }}>
          <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 26, fontWeight: 300, color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em', textDecoration: 'none' }}>
              vida<span style={{ color: '#9b7cc8' }}>.</span>
            </Link>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Link href="/learn" style={{ fontSize: 14, fontWeight: 300, color: '#9b7cc8', padding: '8px 14px' }}>← All articles</Link>
              <Link href="/login" className="m-btn m-btn-ghost-sm">Sign in</Link>
              <Link href="/signup" className="m-btn m-btn-sage-sm">Join free</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Article */}
      <article style={{ maxWidth: 740, margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) 24px clamp(48px, 8vw, 96px)' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
          <Link href="/learn" style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)', textDecoration: 'none' }}>Knowledge Hub</Link>
          <span style={{ color: 'rgba(255,255,255,0.32)', fontSize: 13 }}>›</span>
          <span style={{ fontSize: 13, color: article.color, fontWeight: 300 }}>{article.category}</span>
        </div>

        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: `1.5px solid rgba(155,124,200,0.2)`,
          borderRadius: 24, padding: '32px 28px', marginBottom: 40,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: 'rgba(155,124,200,0.15)',
            border: '1px solid rgba(155,124,200,0.3)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: 16,
            fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 300,
            color: article.color,
          }}>{article.icon}</div>
          <span style={{ fontSize: 11, fontWeight: 300, color: 'rgba(155,124,200,0.7)', textTransform: 'uppercase' as const, letterSpacing: '0.12em' }}>{article.category}</span>
          <h1 style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 300,
            color: 'rgba(255,255,255,0.88)', letterSpacing: '-0.02em', lineHeight: 1.2,
            margin: '10px 0 16px',
          }}>{article.title}</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)' }}>{article.readTime} min read</p>
        </div>

        {/* Intro */}
        <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 48, fontWeight: 300 }}>
          {article.intro}
        </p>

        {/* Sections */}
        {article.sections.map(section => (
          <div key={section.heading} style={{ marginBottom: 40 }}>
            <h2 style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.88)',
              letterSpacing: '-0.015em', lineHeight: 1.3, marginBottom: 14,
              borderLeft: `3px solid ${article.color}`, paddingLeft: 16,
            }}>{section.heading}</h2>
            {section.body.split('\n\n').map((para, i) => (
              <p key={i} style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 16 }}>{para}</p>
            ))}
          </div>
        ))}

        {/* Educational disclaimer */}
        <div style={{
          background: 'rgba(155,124,200,0.06)', border: '1.5px solid rgba(155,124,200,0.14)',
          borderRadius: 18, padding: '20px 22px', marginTop: 48, marginBottom: 48,
        }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.6 }}>
            <strong style={{ color: '#9b7cc8' }}>Educational content only.</strong> This guide is intended to inform, not to replace medical advice. Always discuss symptoms and treatment options with a qualified healthcare provider who knows your full history.
          </p>
        </div>

        {/* CTA */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(155,124,200,0.2)',
          backdropFilter: 'blur(24px)',
          borderRadius: 28, padding: '36px 32px', textAlign: 'center',
          marginBottom: 56,
        }}>
          <p style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 22, fontWeight: 300, color: 'rgba(255,255,255,0.88)', marginBottom: 12 }}>
            Track how your symptoms connect to your life
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 24, lineHeight: 1.6 }}>
            Vida helps you spot the patterns — between sleep and flushes, stress and mood, triggers and symptoms. Free to start.
          </p>
          <Link href="/signup" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#9b7cc8', color: 'rgba(255,255,255,0.88)', borderRadius: 14,
            padding: '14px 28px', fontSize: 15, fontWeight: 300, textDecoration: 'none',
          }}>
            Start tracking for free <ArrowRight size={15} />
          </Link>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,0.88)', marginBottom: 20 }}>
              More in {article.category}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {related.map(r => (
                <Link key={r.slug} href={`/learn/${r.slug}`} style={{
                  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 18px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: 16, textDecoration: 'none',
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, background: 'rgba(155,124,200,0.15)',
                    border: '1px solid rgba(155,124,200,0.3)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0,
                    fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: 16, fontWeight: 300,
                    color: r.color,
                  }}>{r.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.88)', margin: 0, lineHeight: 1.4 }}>{r.title}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.32)', margin: '3px 0 0' }}>{r.readTime} min read</p>
                  </div>
                  <span style={{ color: 'rgba(255,255,255,0.32)', fontSize: 18, flexShrink: 0 }}>›</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
