import { HooksObject } from '@feathersjs/feathers';
import app from '../../app';

const setPostion =async (context: any)=>{
  const n = await app.services.features.find()
  //@ts-ignore
  context.data.position = n.total
   return context
}

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [setPostion],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
