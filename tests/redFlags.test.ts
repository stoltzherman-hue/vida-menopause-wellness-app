import { detectRedFlags } from '@/lib/safety/redFlags'

describe('detectRedFlags', () => {
  it('flags postmenopausal bleeding', () => {
    const result = detectRedFlags('I had postmenopausal bleeding yesterday')
    expect(result.flagged).toBe(true)
    expect(result.label).toBe('postmenopausal_bleeding')
    expect(result.escalationMessage).toBeTruthy()
  })

  it('flags chest pain', () => {
    expect(detectRedFlags("I've been having chest pain all day").label).toBe('chest_pain')
  })

  it('flags stroke symptoms', () => {
    const result = detectRedFlags('My face is drooping and my arm is weak')
    expect(result.flagged).toBe(true)
    expect(result.label).toBe('stroke_symptoms')
  })

  it('flags self-harm', () => {
    const result = detectRedFlags('I want to hurt myself')
    expect(result.flagged).toBe(true)
    expect(result.escalationMessage).toContain('988')
  })

  it('does not flag normal wellness conversation', () => {
    expect(detectRedFlags('I had a hot flash last night and did not sleep well').flagged).toBe(false)
  })

  it('does not flag asking about HRT', () => {
    expect(detectRedFlags('Can you tell me about estrogen patches?').flagged).toBe(false)
  })

  it('flags thunderclap headache', () => {
    expect(detectRedFlags('I just had the worst headache of my life suddenly').label).toBe('severe_headache')
  })
})
