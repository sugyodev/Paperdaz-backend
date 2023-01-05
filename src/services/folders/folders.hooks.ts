import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import getFolderRelatedHook from '../../hooks/get-folder-related-hook';
import { DEFAULT_VALUES } from '../../utils/constants';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const addUserId = async (context: any)=>{
  if (context.params.user.role === DEFAULT_VALUES.users.roles.TEAM_MEMBER){
    context.data.userId = context.params.user.teamId;
    context.data.createdBy = context.params.user.id;
  }else{
    context.data.userId = context.params.user.id;
  }
}

export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [getFolderRelatedHook()],
    get: [getFolderRelatedHook()],
    create: [addUserId],
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
