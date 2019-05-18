import Koa from 'koa'
import KoaRouter from 'koa-router'
import koaCors from '@koa/cors'
import bodyParser from 'koa-bodyparser'
import {graphqlHTTP} from './graph'
const app = new Koa()
const router = new KoaRouter()

router.all('graphql', '/graphql', graphqlHTTP)

const start = async () => {
  app.on('error', (err, ctx) => {
    console.error(err)
  })
}

app
  .use(koaCors())
  .use(router.routes())
  .use(router.allowedMethods({ throw: true }))

const server = app.listen(8088)
console.info('Listening on 8088')
