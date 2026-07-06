import { Redis } from '@upstash/redis'

const kv = Redis.fromEnv()
const DAILY_LIMIT = 20

export async function getUser(email: string) {
  const key = `user:${email}`
  const data = await kv.hgetall(key)
  if (!data) return { count: 0, pro: false, lastReset: '' }
  return {
    count: Number(data.count || 0),
    pro: data.pro === 'true',
    lastReset: String(data.lastReset || '')
  }
}

export async function incCount(email: string) {
  const key = `user:${email}`
  const user = await getUser(email)
  const today = new Date().toISOString().split('T')[0]

  // Daily reset 12am UTC - cron se bhi hoga, ye backup check
  if (user.lastReset!== today) {
    await kv.hset(key, { count: 0, lastReset: today })
    user.count = 0
  }

  if (!user.pro && user.count >= DAILY_LIMIT) return false

  await kv.hincrby(key, 'count', 1)
  await kv.hset(key, 'lastReset', today)
  return true
}

export async function setPro(email: string) {
  await kv.hset(`user:${email}`, 'pro', 'true')
}