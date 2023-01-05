import { HooksObject } from '@feathersjs/feathers';
import app from '../../app';


const test = async (context:any)=>{
  // await app.services.cards.patch(2, {cvv:123});
  context.result = "isaac"
  return context;
}
const test2 = async (context:any)=>{
  // await app.services.cards.patch(2, {cvv:123});
  context.data.text = "1234567890-98765432345678987654"
  return context;
}

const test1 = async (context:any)=>{
  // await app.services.cards.patch(2, {cvv:123});
  context.result = "ameh"
  return context;
}
export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [test, test1, test2],
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
