import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import app from '../../app';
import { sendPermissionRequest } from '../../utils/email-sender/permission-request';
import jwt from 'jsonwebtoken'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const requestPermission =async (context:any)=>{
    if(context.data.action === 'request_permission' ){
      const file = await app.services.files.get(context.data.fileId);

      const checkIfRequested:any = await app.services.permissions.find({query:{fileId:file.id, userId:context.params.user.id}})
      if(checkIfRequested.total > 0){
        // context.result = 'you have requested permission already'
      }
      context.data.userId = context.params.user.id
      context.data.fileOwnerId = file.userId

      let fileOwner = await app.services.users.get(file.userId)


      //send request email
      /** request mail will have a link containing user id and permission id */
      const secret = await app.get('authentication').secret
      const token = jwt.sign({
        data: context.data
      }, secret);

      console.log(fileOwner, context.params.user)
      await app.services.notification.create({ userId: fileOwner.id,
        message:`{${context.params.user.firstName} ${context.params.user.lastName}}, request permission to access {${file.fileName}} click here to grant access {link:${app.get('app_url')}/permission/?permission=${token}}`
      })
      await sendPermissionRequest(fileOwner, context.params.user, `${app.get('app_url')}/permission/?permission=${token}`, file.fileName)

    }
}

const updatePermission =async (context:any)=>{
    if(context.data.action === 'update_permission' ){
      const file = await app.services.files.get(context.data.fileId);
      context.data.userId = context.params.user.id
      context.data.fileOwnerId = file.userId
      const permission:any = await app.services.permissions.find({query: {userId: context.data.userId, fileId:context.data.fileId}})
      const updatePermission = await app.services.permissions.patch(permission.data[0].id, {isGranted: context.data.isGranted})
      const user = await app.services.users.get(context.data.userId)
      const fileOwner = await app.services.users.get(context.data.fileOwnerId)

      await app.services.notification.create({ userId: user.id,
        message:`{${context.params.user.companyName ?? context.params.user.firstName +' '+context.params.user.lastName}}, grant you access to  {${file.fileName}} click here to see file {link:${app.get('app_url')+'/pdf/'+file.paperlink}}`
      })
      await sendPermissionRequest(user, fileOwner, app.get('app_url')+'/pdf/'+file.paperlink, file.fileName)

      context.result = 'permission updated successfully'
      /** request mail will have a link containing user id  */
    }
}



export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [requestPermission, updatePermission],
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
