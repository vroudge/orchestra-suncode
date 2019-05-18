/*
 * Copyright (c) 2019. Orchestra-team.
 */

export const heartbeatController = async ctx => {
  const { body } = ctx.request
  ctx.assert(body.id, 400, 'NO_ID_PROVIDED')
  //get a document
  const doc = await ctx.db.get('device', body.id.toString())
  const now = Date.now()
  await ctx.db.createInCollection(doc, 'device', { ...body, timestamp: now }, body.id, now)

  ctx.body = {
    magnitude: 0,
    duration: 1
  }
}
