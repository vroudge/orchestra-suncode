const Query = {
  entrypoint: async (_, args, { db }) => {
    return db.get('village', 'entry')
  },
  deviceById: async (_, args, { db }) => {
    return db.get('device', args.id)
  },
  villageById: async (_, args, { db }) => {
    return db.get('village', args.id)
  }
}
const Mutation = {
  nodeConfigUpdate: async () => {}
}
const Enums = {}
const Scalars = {}

const customResolveModels = {
  Village: {
    villageConnection: async (_, args, ctx) => {
      return Promise.all(
        _.villageIds.map(async elem => {
          const data = Query.villageById(null, { id: elem }, ctx)
          return { village: data }
        })
      )
    },
    deviceConnection: async (_, args, ctx) => {
      const kek = await Promise.all(
        _.deviceIds.map(async elem => {
          const data = await Query.deviceById(null, { id: elem }, ctx)
          return { device: data }
        })
      )
      return kek
    }
  }
}

export default {
  Query,
  Mutation,
  ...Enums,
  ...Scalars,
  ...customResolveModels
}
