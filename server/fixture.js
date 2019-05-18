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
  const village = await db.create('village', { name: 'Paris', deviceIds:['b','c', 'd'], villageIds: [] }, '1')
  const village2 = await db.create('village', { name: 'San Francisco', deviceIds:['e', 'f'], villageIds: [village.id] }, '2')
  const village3 = await db.create('village', { name: 'Tunis', deviceIds:['g', 'h', 'i', 'j'], villageIds: [village.id, village2.id] }, '3')
  const villageEntryDevice = await db.create('device', { name: 'Generator', type: 'producer', villageId: 'entry', status: 'UNHEALTHY' }, 'a')
  const villageDevice1 = await db.create('device', { name: 'Solar panel', type: 'producer', villageId: village.id, status: 'HEALTHY' }, 'b')
  const villageDevice2 = await db.create('device', { name: 'Wall Battery', type: 'storage', villageId: village.id, status: 'UNHEALTHY' }, 'c')
  const villageDevice3 = await db.create('device', { name: 'Factory', type: 'consumer', villageId: village.id, status: 'UNKNOWN' }, 'd')
  const village2Device1 = await db.create('device', { name: 'Solar panel', type: 'producer', villageId: village2.id, status: 'UNKNOWN' }, 'e')
  const village2Device2 = await db.create('device', { name: 'Wind turbine', type: 'producer', villageId: village2.id, status: 'HEALTHY' }, 'f')
  const village3Device1 = await db.create('device', { name: 'Car battery', type: 'storage', villageId: village3.id, status: 'OFF' }, 'g')
  const village3Device2 = await db.create('device', { name: 'Household', type: 'consumer', villageId: village3.id, status: 'OFF' }, 'h')
  const village3Device3 = await db.create('device', { name: 'Household', type: 'consumer', villageId: village3.id, status: 'HEALTHY' }, 'i')
  const village3Device4 = await db.create('device', { name: 'Coal plant', type: 'producer', villageId: village3.id, status: 'OFF' }, 'j')
  const villageEntry = await db.create('village', { name: 'Melbourne', deviceIds:['a'], villageIds: [village3.id] }, 'entry')
  // cawait db.create('device', {})
})()


