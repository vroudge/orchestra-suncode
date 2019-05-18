/*
 * Copyright (c) 2019. Orchestra-team.
 */

import uuid from "uuid/v1";

const collections = {
  device: "devices",
  village: "villages"
};

export class BaseModel {
  constructor(admin) {
    this.db = admin.firestore();
  }

  async get(name, id) {
    const getData = await this.db
      .collection(collections[name])
      .doc(id)
      .get();
    return { id, ...getData.data() };
  }

  async create(name, data, overrideId) {
    if (!collections[name])
      throw new Error("Model not declared in basemodel collections");
    const id = overrideId || uuid();
    await this.db
      .collection(collections[name])
      .doc(id)
      .set(data);
    return { id, ...data };
  }

  async createInCollection(doc, collectionName, data, overrideId) {
    const id = overrideId || uuid();
    await doc
      .collection(collectionName)
      .doc(id)
      .set(data);
  }
}
