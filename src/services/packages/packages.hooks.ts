import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.
import isAdmin from '../../hooks/is-admin'
import isFreeUser from '../../hooks/is-free-user';

import packageHook from '../../hooks/package-hook';
import getPackagesRelatedHook from '../../hooks/get-packages-related-hook';

const { authenticate } = authentication.hooks;



export default {
  before: {
    all: [ ],
    find: [getPackagesRelatedHook()],
    get: [getPackagesRelatedHook()],
    create: [authenticate('jwt'), packageHook()],
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
