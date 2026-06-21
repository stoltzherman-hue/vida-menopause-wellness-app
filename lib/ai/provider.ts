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

export function getAiProvider(): AiProvider {
  return { chat: anthropicChat }
}
