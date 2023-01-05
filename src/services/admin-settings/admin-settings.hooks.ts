import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import app from '../../app';
import { DEFAULT_VALUES } from '../../utils/constants';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
const setUp =async(context: any)=>{
    // //admin settings
    // try {
      // console.log(1)
      // await app.services["admin-settings"].create({
      //   name:DEFAULT_VALUES.adminSettings.MAX_LEAVES,
      //   value:500000
      // })
    //   console.log(2)
    //   await app.services["admin-settings"].create({
    //     name:DEFAULT_VALUES.adminSettings.REGISTRATION_LEAVES,
    //     value:500
    //   })
    //   console.log(3)
    //   await app.services["admin-settings"].create({
    //     name:DEFAULT_VALUES.adminSettings.REFERRAL_CREDIT,
    //     value:5
    //   })
    //   console.log(4)
    //   await app.services["admin-settings"].create({
    //     name:DEFAULT_VALUES.adminSettings.TOTAL_LEAVES_DISPERSED,
    //     value:0
    //   })
    //   console.log(5)
    //   await app.services["admin-settings"].create({
    //     name:DEFAULT_VALUES.adminSettings.TOTAL_CREDIT_DISPERSED,
    //     value:0
    //   })
    // }catch(err){
    //   console.log(err)
    // }

    return context
}

export default {
  before: {
    all: [  ],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [setUp],
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
