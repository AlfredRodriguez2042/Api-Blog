import app, { apolloServer } from './server'
import { createServer } from 'http'
import v8 from 'v8'

const httpServer = createServer(app)
apolloServer.installSubscriptionHandlers(httpServer)
const PORT = process.env.PORT || 5000

const totalHeapSize = v8.getHeapStatistics().total_available_size
const totalHeapSizeGb = (totalHeapSize / 1024 / 1024 / 1024).toFixed(2)
console.log('totalHeapSizeGb: ', totalHeapSizeGb)

httpServer.listen(PORT, () => {
  console.log(
    `>>>   🚀   Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`
  )
  console.log(
    `>>>   🚀   Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`
  )
})
