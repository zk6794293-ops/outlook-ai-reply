import type { NextApiRequest, NextApiResponse } from 'next'
import { kv } from '@vercel/kv'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Cron job: daily 12am UTC reset - vercel.json se trigger
  if (req.method === 'POST') {
    const users = await kv.keys('user:*')
    const today = new Date().toISOString().split('T')[0]

    for (const key of users) {
      const user = await kv.hgetall(key)
      if (user?.lastReset!== today && user?.pro!== 'true') {
        await kv.hset(key, { count: 0, lastReset: today })
      }
    }
    return res.status(200).json({ reset: users.length })
  }

  // GET: user status check for add-in
  const email = req.query.email as string
  if (!email) return res.status(400).json({ error: 'email required' })

  const key = `user:${email}`
  const data = await kv.hgetall(key)
  const count = Number(data?.count?? 0)
  const pro = data?.pro === 'true'

  res.status(200).json({ count, pro, limit: 20, remaining: pro? 999 : 20 - count })
}