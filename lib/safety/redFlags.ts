export const RED_FLAG_PATTERNS: Array<{pattern: RegExp; label: string; escalation: string}> = [
  { pattern: /postmenopausal\s+bleed|bleeding\s+after\s+menopause/i, label: 'postmenopausal_bleeding', escalation: 'Postmenopausal bleeding always warrants a prompt evaluation by your healthcare provider. Please contact them as soon as possible.' },
  { pattern: /chest\s+pain|chest\s+tightness|chest\s+pressure/i, label: 'chest_pain', escalation: 'Chest pain can be a sign of a serious condition. If this is sudden or severe, please call emergency services (911) right away or go to the nearest emergency room.' },
  { pattern: /sudden\s+headache|worst\s+headache|thunderclap/i, label: 'severe_headache', escalation: 'A sudden severe headache requires emergency evaluation. Please seek care immediately.' },
  { pattern: /can\'?t\s+speak|slurred\s+speech|face\s+(is\s+)?drooping|arm\s+(is\s+)?weak|stroke/i, label: 'stroke_symptoms', escalation: 'These could be stroke symptoms. Call 911 immediately. Time is critical with stroke.' },
  { pattern: /heavy\s+bleeding|soaking\s+pad|flooding/i, label: 'heavy_bleeding', escalation: 'Heavy or unusual bleeding should be evaluated by your healthcare provider promptly.' },
  { pattern: /fainting|passed\s+out|loss\s+of\s+consciousness/i, label: 'fainting', escalation: 'Fainting or loss of consciousness should be evaluated by a healthcare provider.' },
  { pattern: /swollen\s+leg|calf\s+pain|blood\s+clot|DVT|pulmonary/i, label: 'possible_clot', escalation: 'A swollen or painful leg can sometimes indicate a blood clot. Please contact your healthcare provider or seek emergency care if symptoms are severe.' },
  { pattern: /allergic\s+reaction|hives\s+and|throat\s+closing|anaphylax/i, label: 'allergic_reaction', escalation: 'Signs of a severe allergic reaction require emergency care. Call 911 if you have difficulty breathing or throat swelling.' },
  { pattern: /severe\s+abdominal|severe\s+pelvic\s+pain|excruciating\s+pain/i, label: 'severe_abdominal_pain', escalation: 'Severe abdominal or pelvic pain warrants prompt medical evaluation.' },
  { pattern: /want\s+to\s+(hurt|harm|kill)\s+(myself|me)|suicid|self[\s-]?harm/i, label: 'self_harm', escalation: "I'm concerned about your safety. Please reach out to the 988 Suicide & Crisis Lifeline by calling or texting 988. If you are in immediate danger, call 911." },
  { pattern: /severe\s+depression|can\'t\s+get\s+out\s+of\s+bed|hopeless|no\s+reason\s+to\s+live/i, label: 'severe_depression', escalation: 'What you are describing sounds really difficult. Please reach out to a mental health professional or contact the 988 Suicide & Crisis Lifeline (call or text 988).' },
]

export interface RedFlagResult {
  flagged: boolean; label: string | null; escalationMessage: string | null
}

export function detectRedFlags(text: string): RedFlagResult {
  for (const { pattern, label, escalation } of RED_FLAG_PATTERNS) {
    if (pattern.test(text)) {
      return { flagged: true, label, escalationMessage: escalation }
    }
  }
  return { flagged: false, label: null, escalationMessage: null }
}
