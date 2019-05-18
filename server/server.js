import Koa from 'koa'
import KoaRouter from 'koa-router'
import koaCors from '@koa/cors'
import bodyParser from 'koa-bodyparser'

const app = new Koa()
const router = new KoaRouter()

const start = async () => {
  app.on('error', (err, ctx) => {
    console.error(err)
  })
}

app
  .use(koaCors())
  .use(routes(router).routes())
  .use(routes(router).allowedMethods({ throw: true }))

const server = app.listen(8088)