/*
 * Copyright (c) 2019. Orchestra-team.
 */

import koaGraphQL from 'koa-graphql'
import { makeExecutableSchema } from 'graphql-tools'

import resolvers from './resolvers'
import typeDefs  from './schema'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger: {
    log: e => console.error({ workflow: 'api.graphql', details: { error: e } })
  }
})

export const graphqlHTTP = koaGraphQL({
  schema,
  graphiql: true
})