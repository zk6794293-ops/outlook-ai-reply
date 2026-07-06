import { Redis } from '@upstash/redis'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const kv = Redis.fromEnv()
const DAILY_LIMIT = 20

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Cron job: daily 12am UTC reset
    if (req.method === 'POST') {
      let cursor = 0
      let users: string[] = []

      do {
        const [nextCursor, keys] = await kv.scan(cursor, {
          match: 'user:*',
          count: 1000
        })
        cursor = nextCursor
        users.push(...keys)
      } while (cursor!== 0)

      const today = new Date().toISOString().split('T')[0]
      let resetCount = 0

      for (const key of users) {
        const user = await kv.hgetall(key)
        if (user?.lastReset!== today && user?.pro!== 'true') {
          await kv.hset(key, { count: 0, lastReset: today })
          resetCount++
        }
      }
      return res.status(200).json({ reset: resetCount })
    }

    // GET: user status
    const email = req.query.email as string
    if (!email) return res.status(400).json({ error: 'email required' })

    const key = `user:${email}`
    const data = await kv.hgetall(key)
    const count = Number(data?.count?? 0)
    const pro = data?.pro === 'true'

    return res.status(200).json({
      count,
      pro,
      limit: DAILY_LIMIT,
      remaining: pro? 999 : DAILY_LIMIT - count
    })

  } catch (e) {
    console.error('API ERROR:', e)
    return res.status(500).json({ error: String(e) })
  }
}