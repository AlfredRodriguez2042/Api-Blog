import { ApolloServer, PubSub } from 'apollo-server-express'
import express from 'express'
import redis from 'redis'
import session from 'express-session'
import connectRedis from 'connect-redis'
import cookieParser from 'cookie-parser'
import { schema } from './graphql/index'
import { Connect } from './database'
import { config } from 'dotenv'
import { authMiddleware } from './middleware/auth'

config()
Connect()
const RedisStore = connectRedis(session)
const client = redis.createClient()
const app = express()
const pubsub = new PubSub()
const path = '/graphql'
const corsOptions = {
  credentials: true,
  origin: 'http://localhost:8080'
}
const store = new RedisStore({ client })

app.use(
  session({
    store,
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    }
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//app.use(path, authMiddleware)
app.use(cookieParser())

export const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  context: request => ({ request })
})

apolloServer.applyMiddleware({ app, path, cors: corsOptions })

export default app
