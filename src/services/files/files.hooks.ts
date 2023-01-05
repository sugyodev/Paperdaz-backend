import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import app from '../../app';
import getFileRelatedHook from '../../hooks/get-file-related-hook';
import { isContext } from 'vm';
import { DEFAULT_VALUES } from '../../utils/constants';
// import { Request, Response, NextFunction } from 'express';

// Don't remove this comment. It's needed to format import lines nicely.
const { authenticate } = authentication.hooks;


const checkIfShareWasUpdated = async (context: any) => {
  if (context.data.shared) {
    await app.services['social-share'].create({
      socialMedia: context.data.shared
    });
  }
  return context
}

const saveEditingFile = async (context: any) => {
  if (context.data.isEditing == true) {
    const file = await app.services.files.get(context.data.originalFileId)
    const user = await app.services.users.get(context.data.userId)
    context.data.fileName = file.fileName;
    context.data.userId = user.id
    context.data.role = user.role
    context.data.userName = user.firstName + " " + user.lastName,
      context.data.leavesEarned = 0,
      context.data.uploadedBy = user.id
    context.data.paperLink = new Date().getTime().toString()
  }
  return context
}


export default {
  before: {
    all: [],
    find: [getFileRelatedHook()],
    get: [getFileRelatedHook()],
    create: [saveEditingFile],
    update: [authenticate('jwt')],
    patch: [authenticate('jwt'), checkIfShareWasUpdated],
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
