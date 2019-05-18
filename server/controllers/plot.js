/*
 * Copyright (c) 2019. Orchestra-team.
 */

export const plotController = async ctx => {
  const { body } = ctx.request
  await ctx.db.create('plot', { data: JSON.stringify(body) }, 'plot')
  ctx.body = {
    ok: true
  }
}
