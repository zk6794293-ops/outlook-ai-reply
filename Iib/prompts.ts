export const TONES = {
  short: {
    name: 'Short',
    prompt: 'Reply in 1 line, polite, under 15 words. Be direct.',
    proOnly: false
  },
  pro: {
    name: 'Professional', 
    prompt: 'Professional business reply, 2-3 lines. Formal tone, no slang.',
    proOnly: true
  },
  friendly: {
    name: 'Friendly',
    prompt: 'Friendly warm reply, 2 lines. Use casual words but stay respectful.',
    proOnly: true
  }
} as const

export function getPrompt(tone: keyof typeof TONES, emailText: string) {
  return `${TONES[tone].prompt} Original email: ${emailText}`
}