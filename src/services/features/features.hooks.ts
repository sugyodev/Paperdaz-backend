import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
import { Hook, HookContext } from '@feathersjs/feathers';
import app from '../../app';
import getFeaturesRelatedHook from '../../hooks/get-features-related-hook';

const setPostion =async (context: any)=>{
  const n = await app.services.features.find()
  //@ts-ignore
  context.data.position = n.total
   return context
}


export default {
  before: {
    all: [ ],
    find: [getFeaturesRelatedHook()],
    get: [getFeaturesRelatedHook()],
    create: [authenticate('jwt'), setPostion],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt')],
    remove: [authenticate('jwt')]
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
