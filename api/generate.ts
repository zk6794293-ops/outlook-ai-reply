import Groq from 'groq-sdk'
import { kv } from '@vercel/kv'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// KV helper functions - db.ts ki zaroorat nahi
async function getUser(email: string) {
  const key = `user:${email}`
  const data = await kv.hgetall(key)
  const count = Number(data?.count?? 0)
  const pro = data?.pro === 'true'
  return { count, pro }
}

async function incCount(email: string) {
  const key = `user:${email}`
  const user = await getUser(email)

  // Pro user = no limit
  if (user.pro) return true

  // Free user: 20/day limit
  if (user.count >= 20) return false

  await kv.hset(key, { count: user.count + 1 })
  return true
}

export default async function handler(req: any, res: any) {
  if (req.method!== 'POST') return res.status(405).end()

  const { email, original, tone = 'short' } = req.body
  if (!email ||!original) return res.status(400).json({ error: 'email + original required' })

  // Check limit + auto reset
  const canReply = await incCount(email)
  if (!canReply) return res.status(429).json({ error: 'Daily limit reached. Upgrade Pro' })

  const user = await getUser(email)

  // Tone unlock logic: Pro+Friendly = Pro only
  if (tone!== 'short' &&!user.pro) {
    return res.status(403).json({ error: 'Pro tone. Upgrade required' })
  }

  const prompts = {
    short: `Reply in 1 line, polite, under 15 words. Email: ${original}`,
    pro: `Professional business reply, 2-3 lines. Email: ${original}`,
    friendly: `Friendly warm reply, 2 lines. Email: ${original}`
  }

  try {
    // <2 sec timeout
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 1800)

    const chat = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompts[tone as keyof typeof prompts] }],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 100
    }, { signal: controller.signal })

    clearTimeout(timeout)
    const reply = chat.choices[0]?.message?.content || 'Sorry, try again'

    res.status(200).json({ reply, remaining: user.pro? 999 : 19 - user.count })
  } catch (e) {
    res.status(500).json({ error: 'Timeout or Groq error' })
  }
}