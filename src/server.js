import { ApolloServer, PubSub } from 'apollo-server-express'
import express from 'express'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import { schema } from './graphql/index'
import { Connect } from './database'
import { config } from 'dotenv'
import { middlewareSession } from './middleware/auth'
import { UserLoader, PostLoader } from './utils/Loaders'
import { client, RedisCache, store } from './utils/Redis'
import Post from './models/post'

config()
Connect()
RedisCache(Post)

const app = express()
const pubsub = new PubSub()
const path = '/graphql'
const corsOptions = {
  credentials: true,
  origin: 'http://localhost:8080'
}

app.use(
  session({
    name: 'qid',
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
app.use(path, middlewareSession)
app.use(cookieParser(process.env.JWT_SECRET))

export const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  context: request => ({ client, request, pubsub, UserLoader, PostLoader })
})

//client.del(process.env.REDIS_CACHE_KEY)

apolloServer.applyMiddleware({ app, path, cors: corsOptions })

export default app
