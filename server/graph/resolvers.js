const Query = {
  plot: async (_, args, { db }) => {
    const plot = await db.get('plot', 'plot')
    return plot.data
  },
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
  nodeConfigUpdate: async (_, { input }, { db }) => {
    const updated = await db.update('device', input.deviceId, {
      ...input
    })
    return db.get('device', input.deviceId)
  }
}

const Enums = {}
const Scalars = {}

const customResolveModels = {
  Device: {
    state: async (_, args, { db }) => {
      const res = await db.getLatestStateOfDevice(_.id, 'timestamp', 'desc')
      return res
    }
  },
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
          return { device: { ...data, legacy: false } }
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
