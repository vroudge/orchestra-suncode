/*
 * Copyright (c) 2019. Orchestra-team.
 */

import uuid from 'uuid/v1'
import lodash from 'lodash'
const collections = {
  device: 'devices',
  village: 'villages',
  plot: 'plot'
}

export class BaseModel {
  constructor (admin) {
    this.db = admin.firestore()
  }

  async get (name, id) {
    const getData = await this.db
      .collection(collections[name])
      .doc(id)
      .get()
    return { id, ...getData.data() }
  }

  async getLatestStateOfDevice (id, by, ordered) {
    console.info(id, by, ordered)
    const getData = await this.db.collection(`devices/${id}/state`).get()

    const results = []
    getData.forEach(elem => {
      results.push(elem)
    })
    const res = results
      .map(elem => {
        return elem.data()
      })
      .sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
      })

    return { ...res[res.length - 1] }
  }

  async create (name, data, overrideId) {
    if (!collections[name])
      throw new Error('Model not declared in basemodel collections')
    const id = overrideId || uuid()
    await this.db
      .collection(collections[name])
      .doc(id)
      .set(data)
    return { id, ...data }
  }

  async update (name, id, data) {
    console.info(name, id, data)
    await this.db
      .collection(collections[name])
      .doc(id)
      .set(_.pick(data))
  }

  async createInCollection (
    doc,
    collectionName,
    data,
    overrideId,
    overrideSubId
  ) {
    console.info(data)
    const id = overrideId || uuid()
    const subId = overrideSubId || uuid()
    await this.db
      .collection(`${collections[collectionName]}/${id}/state`)
      .doc(subId.toString())
      .set(_.pick(data))
  }
}
