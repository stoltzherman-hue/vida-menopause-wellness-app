// AI provider abstraction — swap provider via AI_PROVIDER env var

export interface AiMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AiResponse {
  content: string
  model: string
  inputTokens: number
  outputTokens: number
}

export interface AiProvider {
  chat(messages: AiMessage[], options?: ChatOptions): Promise<AiResponse>
}

export interface ChatOptions {
  maxTokens?: number
  temperature?: number
  systemPrompt?: string
}

// ─── Anthropic provider ────────────────────────────────────────────────────────

async function anthropicChat(
  messages: AiMessage[],
  options: ChatOptions = {}
): Promise<AiResponse> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const anthropicMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: options.maxTokens ?? 1000,
    system: options.systemPrompt,
    messages: anthropicMessages,
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  return {
    content: textBlock && 'text' in textBlock ? (textBlock as { type: 'text'; text: string }).text : '',
    model: response.model,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  }
}

// ─── OpenAI provider ───────────────────────────────────────────────────────────

async function openAiChat(messages: AiMessage[], options: ChatOptions = {}): Promise<AiResponse> {
  const { default: OpenAI } = await import('openai')
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const systemMessages = options.systemPrompt
    ? [{ role: 'system' as const, content: options.systemPrompt }]
    : []

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [...systemMessages, ...messages],
    max_tokens: options.maxTokens ?? 1000,
    temperature: options.temperature ?? 0.7,
  })

  const choice = response.choices[0]
  return {
    content: choice.message.content ?? '',
    model: response.model,
    inputTokens: response.usage?.prompt_tokens ?? 0,
    outputTokens: response.usage?.completion_tokens ?? 0,
  }
}

// ─── Factory ───────────────────────────────────────────────────────────────────

export function getAiProvider(): AiProvider {
  const provider = process.env.AI_PROVIDER ?? 'anthropic'

  if (provider === 'openai') {
    return { chat: openAiChat }
  }

  return { chat: anthropicChat }
}
