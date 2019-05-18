/*
 * Copyright (c) 2019. Orchestra-team.
 */

import fbadmin from 'firebase-admin'
import { BaseModel } from './models/baseModel'

(async () => {
  const serviceAccount = require('./orchestra-suncode-firebase-adminsdk-mfqkb-83ab056f09')
  fbadmin.initializeApp({
    credential: fbadmin.credential.cert(serviceAccount),
    databaseURL: 'https://orchestra-suncode.firebaseio.com'
  })

  const db = new BaseModel(fbadmin)
  const village = await db.create('village', { name: 'Paris', villageIds: [] })
  const village2 = await db.create('village', { name: 'Paris', villageIds: [village.id] })
  const village3 = await db.create('village', { name: 'Paris', villageIds: [village.id, village2.id] })
  const villageEntry = await db.create('village', { name: 'Paris', villageIds: [village3.id] }, 'entry')
  // cawait db.create('device', {})
})()


