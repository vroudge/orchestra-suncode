/*
 * Copyright (c) 2019. Orchestra-team.
 */

export const configController = async ctx => {
  const { body } = ctx.request
  ctx.assert(body.id, 400, 'NO_ID_PROVIDED')

  ctx.body = {
    objectId: '',
    villageId: '',
    type: '',
    legacy: true,
    values: [],
    commandable: true
  }
}
