import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
// import { sendEmail} from '../../utils/sendEmail';
import { sendRequestMail } from '../../utils/Mail/sendRequestEmail';
import { BadRequest } from '@feathersjs/errors';
import app from '../../app';
import { DEFAULT_VALUES } from '../../utils/constants';
import { sendReferalMail } from '../../utils/Mail/sendReferralEmail';
import { sendInviteMail } from '../../utils/Mail/sendInviteEmail';
import { sendSaveFile } from '../../utils/email-sender/save-file';
import {sendFileActionUser } from '../../utils/email-sender/file-action-user';
import { sendFileActionBusiness } from '../../utils/email-sender/file-action-business';
import { sendTeamInvite } from '../../utils/email-sender/team-invitation';
import { sendAdminInvite } from '../../utils/email-sender/admin-invitation';
import { sendRegistrationEmail } from '../../utils/email-sender/registration';
import jwt from 'jsonwebtoken';
import { BadGateway, NotFound, NotImplemented } from '@feathersjs/errors';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
  

const ShareFile = async (context: any) =>{
  if(context.data.action === DEFAULT_VALUES.emailAction.SHARE_FILE){
    if(!context.data.editedFileLink && !context.data.fileId){
       throw new BadRequest('file link and fileId must be provided')
    }
    if(context.data.emails.length > 0){
      await context.data.emails.map(async (email:any, index:number) => {
        sendRequestMail(email, context.data.note ?? '', context.data.editedFileLink);  // add cc
         await app.services.request.create({
           fileId:context.data.fileId,
           email:email,
           note:context.data.note ?? '',
           editedFileLink:context.data.editedFileLink
         })
         //create notification if email exist
         const user:any = await app.services.users.find({query: {email:email}})
         if(user.total > 0) {
            //check if users allow app notification
            const notificationSettings:any = await app.services['notification-settings'].find({query: {userId:user.data[0].id, type: DEFAULT_VALUES.notificationType.APP, inviteRequest: true}})
            if(notificationSettings.length > 0){
              await app.services.notification.create({
                message:'{'+user.data[0].firstName + ' ' + user.data[0].lastName +'}'+ ' ' + DEFAULT_VALUES.notificationMessage.REQUEST_TO_SIGN_A_FILE,
                userId: user.data[0].id
              })
            }
         }

       })

      await app.services.files.patch(context.data.fileId, {fileAction: DEFAULT_VALUES.fileActions.SHARED})
      const reward:any = await app.services.leaves.find({query: {action: DEFAULT_VALUES.fileActions.SHARED}})
      await app.services.users.patch(context.params.user.id, {totalLeavesEarned: context.params.user.totalLeavesEarned + reward[0].leavesPerAction});

      context.result = "request sent succesfully"
      return context
    }else{
      throw new BadRequest('email must be provided')
    }

  }
    return context
}



const InviteLink = async (context: any) =>{
  if(context.data.action === DEFAULT_VALUES.emailAction.INVITE_LINK){
    if(context.data.emails.length > 0){
      await context.data.emails.map(async (email:any) => {
        const user:any = await app.services.users.find({query: {email:email}})
        if(user.total > 0){
          sendTeamInvite(user.data[0], context.params.user, context.data.link)
        }else{
          sendTeamInvite({
            email,
            firstName:email,
            profilePicture:'',
            role:DEFAULT_VALUES.users.roles.FREE_USER
          }, context.params.user, context.data.link)
        }
       })
       context.result = "invite link sent succesfully"
       return context
    }else{
      throw new BadRequest('email must be provided')
    }
  }
    return context
}

const JoinAdmin = async (context: any) =>{
  if(context.data.action === 'join_admin'){
    const user:any = await app.services.users.find({query: {email:context.data.email}})
    if(user.total > 0){
      sendAdminInvite(user.data[0], context.params.user, context.data.link)
      context.result = "invite link sent succesfully"
    }else{
      throw new BadRequest('email must belong to a user')
    }
    return context
  }
    return context
}

const ReferralLink = async (context: any) =>{
  if(context.data.action === DEFAULT_VALUES.emailAction.REFERRAL_LINK){
    if(context.data.emails.length > 0){
      await context.data.emails.map(async (email:any) => {
         sendReferalMail(email, context.data.link);
       })
       context.result = "Referral link sent succesfully"
       return context
    }else{
      throw new BadRequest('email must be provided')
    }
  }
    return context
}

const SaveAction = async (context: any) =>{
     if(context.data.action === 'save'){
      const attachment = await  context.data.editedFileLink ?? context.data.link;
      const file = await app.services.files.get(context.data.fileId) 
      await sendSaveFile(context.params.user, attachment, file)
      context.result = 'file saved'
    }
    return context
}


const FileAction = async (context: any) =>{
     if(context.data.action === 'complete' || context.data.action === 'confirm' || context.data.action === 'sign'){
      const attachment = context.data.editedFileLink ?? context.data.link;
      const file = await app.services.files.get(context.data.fileId) 
      const user = await app.services.users.get(context.params.user.id)
      const business = await app.services.users.get(file.userId)

      console.log("user", user, "userb",business, file, 'attachment', attachment)

      await sendFileActionUser(user, attachment, file, context.data.action);
      await sendFileActionBusiness(user, business, attachment, file, context.data.action)
      context.result = context.data.action +' success'
    }
    return context
}


export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [
      // sendRequest, 
      ReferralLink,
      ShareFile,
      InviteLink,
      SaveAction, 
      FileAction,
      JoinAdmin,

    ],
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
