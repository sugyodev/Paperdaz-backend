import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import addUserId from '../../hooks/add-user-id';
require("dotenv").config();
// Don't remove this comment. It's needed to format import lines nicely.
const stripe = require('stripe')(process.env.STRIPE_S_Key);
const { authenticate } = authentication.hooks;

//stripe verify card check
const verifyCard =async (context:any)=>{
  const token = await stripe.tokens.create({
    card: {
      number: context.data.card_number,
      exp_month: parseInt(context.data.exp_month),
      exp_year: parseInt(context.data.exp_year),
      cvc: context.data.cvv,
    },
  })

  // console.log(token);
}



export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [verifyCard, addUserId() ],
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
