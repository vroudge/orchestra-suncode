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
  nodeConfigUpdate: async (_, args, { db }) => {

  }
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
      return Promise.all(
        _.deviceIds.map(async elem => {
          const data = await Query.deviceById(null, { id: elem }, ctx)
          return { device: data }
        })
      )
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
