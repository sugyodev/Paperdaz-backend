import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import addUserId from '../../hooks/add-user-id';
import getFavouritesRelatedHookCopy from '../../hooks/get-favourites-related-hook copy';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [getFavouritesRelatedHookCopy()],
    get: [getFavouritesRelatedHookCopy()],
    create: [addUserId()],
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
