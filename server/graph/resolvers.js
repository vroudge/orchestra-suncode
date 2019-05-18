const Query = {
  entrypoint: async (_, args, { db }) => {
    return db.get("village", "entry");
  },
  deviceById: async (_, args, { db }) => {
    return db.get("device", args.id);
  },
  villageById: async (_, args, { db }) => {
    return db.get("village", args.id);
  }
};
const Mutation = {
  nodeConfigUpdate: async () => {}
};
const Enums = {};
const Scalars = {};

const customResolveModels = {
  DeviceEdge: {
    device: async () => {}
  },
  Device: {
    __resolveType: async args => {
      console.info(args);
      switch (args.type) {
        case "producer":
          return "Producer";
        case "consumer":
          return "Consumer";
        case "storage":
          return "Storage";
        default:
          return null;
      }
    }
  },
  Village: {
    villageConnection: async (_, args, ctx) => {
      console.log(_.villageIds);
      return Promise.all(
        _.villageIds.map(async elem => {
          const data = Query.villageById(null, { id: elem }, ctx);
          return { village: data };
        })
      );
    },
    deviceConnection: async () => {
      return [
        { device: { id: 1, type: "producer" } },
        { device: { id: 2, type: "consumer" } },
        { device: { id: 3, type: "storage" } }
      ];
    }
  }
};

export default {
  Query,
  Mutation,
  ...Enums,
  ...Scalars,
  ...customResolveModels
};
