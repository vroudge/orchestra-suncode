/*
 * Copyright (c) 2019. Orchestra-team.
 */

export const heartbeatController = async ctx => {
  const { body } = ctx.request
  ctx.assert(body.id, 400, 'NO_ID_PROVIDED')
  ctx.assert(body.available, 400, 'NO_AVAILABILITY_PROVIDED')
  /*
  {
    "available": true,
    "max_output": 10,
    "max_output_duration": 10,
    "current_command": {
      "magnitude": 0,
      "duration": 0,
      "command_timeout": 0
    }
  }
   */
  ctx.body = {
    magnitude: 0,
    duration: 0,
    energized: false,
    command_timeout: 0
  }
}
