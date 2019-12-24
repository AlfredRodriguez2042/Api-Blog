import { makeExecutableSchema } from 'apollo-server-express'
import path from 'path'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './types')))
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, './resolvers'))
)
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})
