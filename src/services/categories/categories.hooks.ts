import { HooksObject } from '@feathersjs/feathers';
import app from '../../app';
import getRelatedHook from '../../hooks/get-category-related-hook';


const setPostion =async (context: any)=>{
  const n = await app.services.features.find()
  //@ts-ignore
  context.data.position = n.total
   return context
}


export default {
  before: {
    all: [],
    find: [getRelatedHook()],
    get: [getRelatedHook()],
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
