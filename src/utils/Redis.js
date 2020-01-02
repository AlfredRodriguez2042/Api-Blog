import redis from 'ioredis'
import session from 'express-session'
import connectRedis from 'connect-redis'

const RedisStore = connectRedis(session)
export const client = redis.createClient()
export const store = new RedisStore({ client })

client.on('connect', () => console.log('Redis is connected'))

export const RedisCache = async model => {
  await client.del(process.env.REDIS_CACHE_KEY)
  const items = await model.find()
  const StringItems = items.map(item => JSON.stringify(item))

  return await client.lpush(process.env.REDIS_CACHE_KEY, ...StringItems)
}
