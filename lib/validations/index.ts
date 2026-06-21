import { z } from 'zod'

// ─── Auth ──────────────────────────────────────────────────────────────────────

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters').max(50),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

// ─── Onboarding ────────────────────────────────────────────────────────────────

export const menopauseStageSchema = z.enum([
  'perimenopause',
  'menopause',
  'post_menopause',
  'surgical_menopause',
  'premature_ovarian_insufficiency',
  'unsure',
])

export const onboardingSchema = z.object({
  ageRange: z.string().optional(),
  menopauseStage: menopauseStageSchema.optional(),
  primarySymptoms: z.array(z.string()).max(30),
  hrtStatus: z.string().optional(),
  medicalHistory: z.array(z.string()),
  lifestyle: z.object({
    sleepHoursAvg: z.number().min(0).max(24).optional(),
    stressLevel: z.number().min(1).max(10).optional(),
    alcoholFrequency: z.string().optional(),
    caffeineFrequency: z.string().optional(),
    exerciseFrequency: z.string().optional(),
    dietPreferences: z.array(z.string()),
    smokingStatus: z.string().optional(),
  }),
  goals: z.array(z.string()).max(3),
  consentHealthData: z.boolean(),
  consentAiAnalysis: z.boolean(),
  consentCommunity: z.boolean(),
  consentNotifications: z.boolean(),
  consentMarketing: z.boolean(),
})

// ─── Check-in ──────────────────────────────────────────────────────────────────

export const checkinSchema = z.object({
  checkinDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD'),
  overallWellbeing: z.number().min(1).max(10).optional(),
  mood: z.number().min(1).max(10).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  sleepQuality: z.number().min(1).max(5).optional(),
  energyLevel: z.number().min(1).max(10).optional(),
  hotFlashCount: z.number().min(0).max(100).optional(),
  hotFlashSeverity: z.number().min(1).max(5).optional(),
  nightSweatsCount: z.number().min(0).max(100).optional(),
  nightSweatsSeverity: z.number().min(1).max(5).optional(),
  periodStatus: z.enum(['none', 'spotting', 'light', 'normal', 'heavy']).optional(),
  triggers: z.array(z.string()).max(20),
  notes: z.string().max(2000).optional(),
})

export const symptomLogSchema = z.object({
  symptomId: z.string().uuid(),
  severity: z.number().min(0).max(10),
  checkinId: z.string().uuid().optional(),
  notes: z.string().max(500).optional(),
})

// ─── Medication ────────────────────────────────────────────────────────────────

export const medicationCategorySchema = z.enum([
  'estrogen',
  'progesterone',
  'combined_hrt',
  'vaginal_estrogen',
  'testosterone',
  'non_hormonal_prescription',
  'supplement',
  'other',
])

export const medicationSchema = z.object({
  name: z.string().min(1).max(200),
  dose: z.string().max(100).optional(),
  route: z.string().max(100).optional(),
  frequency: z.string().max(100).optional(),
  timeOfDay: z.array(z.string()).max(6),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  category: medicationCategorySchema,
  prescribingClinician: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
})

// ─── Community ─────────────────────────────────────────────────────────────────

export const forumPostSchema = z.object({
  categoryId: z.string().uuid(),
  title: z.string().min(3, 'Title must be at least 3 characters').max(300),
  body: z.string().min(1, 'Please write something before posting').max(10000),
})

export const forumReplySchema = z.object({
  postId: z.string().uuid(),
  body: z.string().min(1).max(5000),
})

export const moderationReportSchema = z.object({
  targetType: z.enum(['post', 'reply', 'profile']),
  targetId: z.string().uuid(),
  reason: z.enum([
    'misinformation',
    'harmful_advice',
    'spam',
    'harassment',
    'off_topic',
    'crisis_content',
    'other',
  ]),
  details: z.string().max(1000).optional(),
})

// ─── AI ────────────────────────────────────────────────────────────────────────

export const aiMessageSchema = z.object({
  conversationId: z.string().uuid().optional(),
  message: z.string().min(1).max(4000),
  mode: z.enum([
    'supportive_friend',
    'wellness_coach',
    'doctor_prep',
  ]).optional(),
})

// ─── Reports ───────────────────────────────────────────────────────────────────

export const reportRequestSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  includeSymptoms: z.boolean().default(true),
  includeMedications: z.boolean().default(true),
  includeCycles: z.boolean().default(true),
  includeJournal: z.boolean().default(false),
  includeRedFlags: z.boolean().default(true),
})
