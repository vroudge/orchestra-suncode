import Koa from 'koa'
import KoaRouter from 'koa-router'
import koaCors from '@koa/cors'

const start = async () => {
  app.on('error', (err, ctx) => {
    console.error(err)
  })
}

app
  .use(koaCors())
  .use(errorHandlerMiddleware(logger))
  .use(dbConnectionMiddleware)
  .use(routes(router).routes())
  .use(routes(router).allowedMethods({ throw: true }))

const server = app.listen(8088)