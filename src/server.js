import { ApolloServer, PubSub } from 'apollo-server-express'
import express from 'express'
import helmet from 'helmet'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import { schema } from './graphql/index'
import { Connect } from './database'
import { config } from 'dotenv'
import { middlewareSession, formatError } from './middleware/auth'
import { UserLoader, PostLoader } from './utils/Loaders'
import { client, RedisCache, store } from './utils/Redis'
import depthLimit from 'graphql-depth-limit'
import costAnalyzer from 'graphql-cost-analysis'
import rateLimit from 'express-rate-limit'
import { httpsRedirect, wwwRedirect } from './utils/Redirect'

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
// redirects should be ideally setup in reverse proxy like nignx
if (process.env.NODE_ENV === 'production') {
  console.log('production')
  app.use('/*', httpsRedirect())

  app.get('/*', wwwRedirect())

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each IP to 100 requests per windowMs
    })
  )
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
app.enable('trust proxy')
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(path, middlewareSession)
app.use(cookieParser(process.env.JWT_SECRET))

export const apolloServer = new ApolloServer({
  schema,
  introspection: process.env.NODE_ENV !== 'production',
  context: request => ({
    client,
    request,
    pubsub,
    UserLoader,
    PostLoader
  }),
  validationRules: [
    depthLimit(5),
    costAnalyzer({
      variables: {}, // req.body.variables,
      maximumCost: 1000
    })
  ],
  formatError
})

apolloServer.applyMiddleware({ app, path, cors: corsOptions })

export default app

// class EnhancedServer extends ApolloServer {
//   async createGraphQLServerOptions(
//     req: express.Request,
//     res: express.Response
//   ): Promise<GraphQLOptions> {
//     const options = await super.createGraphQLServerOptions(req, res);

//     return {
//       ...options,
//       validationRules: [
//         ...options.validationRules,
//         costAnalysis({variables: req.body.variables})
//       ]
//     };
//   }
// }```
