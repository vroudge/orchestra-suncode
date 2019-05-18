import koaGraphQL from 'koa-graphql'
import { applyMiddleware } from 'graphql-middleware'
import { makeExecutableSchema } from 'graphql-tools'

import resolvers from './resolvers'
import { typeDefs } from './schema'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger: {
    log: e => logger.error({ workflow: 'api.graphql', details: { error: e } })
  }
})

const boundMiddleware = applyMiddleware(schema, graphqlShieldMiddleware)

export const graphqlHTTP = koaGraphQL({
  schema: boundMiddleware,
  graphiql: true
})