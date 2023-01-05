import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import app from '../../app';
import { DEFAULT_VALUES } from '../../utils/constants';
import generator from "generate-password";
import { BadGateway, NotFound, NotImplemented } from '@feathersjs/errors';
import axios from 'axios';
import { sendJoinMail } from '../../utils/Mail/sendJoinEmail';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { sendForgotPasswordMail } from '../../utils/Mail/sendForgotPaswordEmail';
import { sendRegistrationEmail } from '../../utils/email-sender/registration';
import { sendForgotPassword } from '../../utils/email-sender/forgot-password';
import sendReferralCredit from '../../utils/email-sender/referal-rewards';
import { sendTeamInvite } from '../../utils/email-sender/team-invitation';
import {v4 as uuidv4} from 'uuid';
import { sendJoinTeamMail } from '../../utils/email-sender/join-team';

// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
const { hashPassword, protect } = local.hooks;

const addReferralCode = async (context: any)=>{
  var code = generator.generate({
    length: 10,
    numbers: true
  });
    context.data.referralCode = code
    return context
}

const rewardReferralCredit = async (context: any)=>{
  //@ts-ignore
  if(context.data.referreeCode){
    //check if code if valid
    const referree:any = await app.services.users.find({query: {referralCode: context.data.referreeCode}})
    let regLeaves:any = await app.services['admin-settings'].find({query: {name: DEFAULT_VALUES.adminSettings.REGISTRATION_LEAVES}})
    if(referree.total > 0){
      //update totalcredit earned credit
      let referreeTotalLeaves = referree.data[0].totalLeavesEarned + regLeaves[0].value
      let numberOfReferrals = referree.data[0].numberOfReferrals + 1
      await app.services.users.patch(referree.data[0].id,{totalLeavesEarned: referreeTotalLeaves, numberOfReferrals: numberOfReferrals})

      //create notification
      const notificationSettings:any = await app.services['notification-settings'].find({query:{userId:referree.data[0].id}})
      let message = '{'+context.result.firstName + ' ' + context.result.lastName +'}'+ ' ' + DEFAULT_VALUES.notificationMessage.SUCCESSFULLY_REFERRAL_SIGNUP+ 'you earn ' + regLeaves[0].value+' leaves';
      notificationSettings.map(async (notification:any) =>{
        if(notification.type === DEFAULT_VALUES.notificationType.APP && notification.referalCredit === true){
          await app.services.notification.create({
            message:message,
            userId: referree.data[0].id
          })
        }
        if(notification.type === DEFAULT_VALUES.notificationType.EMAIL && notification.referalCredit === true){
            // sendJoinMail(referree.data[0].email, message)
            let refIsBusiness  = false
            let userIsBusiness = false

           if(referree.data[0].role === DEFAULT_VALUES.users.roles.PAID_USER){
            refIsBusiness  = true
           }
           if(context.result.role === DEFAULT_VALUES.users.roles.PAID_USER){
            userIsBusiness  = true
           }
            await sendReferralCredit(referree.data[0], context.result, regLeaves[0].value.toString(), 'leaves', refIsBusiness, userIsBusiness)
        }
      })

      //create refral history
     await app.services.referral.create({
        type:DEFAULT_VALUES.referalType.REGISTERATION,
        referreeName:referree.data[0].firstName + ' ' + referree.data[0].lastName,
        referreeCompanyName:referree.data[0].companyName ?? '',
        newUserName:context.result.firstName + ' ' +context.result.lastName ,
        newUserCompanyName:context.result.companyName ?? '',
        leavesEarned: regLeaves[0].value,
        referralCode: context.data.referreeCode
      })

      //save referree on user data
      await app.services.users.patch(context.result.id, {referreeId: referree.data[0].id})
      //get dispaersed leaves
      let disperseLeaves:any = await app.services['admin-settings'].find({query: {name: DEFAULT_VALUES.adminSettings.TOTAL_LEAVES_DISPERSED}})
      let totalLeavesDispersed = disperseLeaves[0].value + regLeaves[0].value
      await app.services['admin-settings'].patch(disperseLeaves[0].id, {value: totalLeavesDispersed})
    }
  }
  return context
}

const joinATeam = async (context: any)=>{
  if(context.data.teamId){
    //find team
    const team:any = await app.services.users.get(context.data.teamId);
    const teamSubscription:any = await app.services.subscriptions.find({query:{userId: team.id}})
    const currentMembers:any = await app.services.users.find({query:{teamId: team.id}})

    if(currentMembers.total >= teamSubscription.data[0].teamMembers){
      throw new NotFound('team has exceeded maximum number of team members')
    }
    if(teamSubscription.data[0].status === DEFAULT_VALUES.subscriptionsStatus.EXPIRED){
      throw new NotFound('team subcription is expired')
    }

    if(team.role === DEFAULT_VALUES.users.roles.PAID_USER){
      //owner can not be a team member
      const user = await app.services.users.get(context.data.userId);
      //check that the user is not in already
      const checkIfAlreadyRegistered:any = await app.services.users.find({query:{teamId:context.data.teamId, mainAccountId: context.data.userId}})
      if(checkIfAlreadyRegistered.total > 0){
        throw new NotFound('user is already a member of this team')
      }

      if(context.data.teamId != user.id){
        //create a team account
        context.data.firstName = user.firstName;
        context.data.lastName = user.lastName;
        context.data.profilePicture = user.profilePicture;
        context.data.email = user.email.split('@')[0] + "@paperdaz-" + Date.now().toString() +'.com';
        context.data.password = user.referralCode;
        context.data.role = DEFAULT_VALUES.users.roles.TEAM_MEMBER
        context.data.status = DEFAULT_VALUES.users.status.PENDING,
        context.data.mainAccountId = user.id;
        context.data.teamAccess = DEFAULT_VALUES.membersAccess.OWN_FILES
        context.data.referralCode = null

        //create notification
        const appNotificationSettings:any = await app.services['notification-settings'].find({query:{userId: context.data.teamId}});
        appNotificationSettings.map(async (notification:any) => {
            if(notification.type === DEFAULT_VALUES.notificationType.APP){
              //create in-app notification
              if(notification.inviteRequest === true){
                await app.services.notification.create({
                  message: +'{'+ user.firstName + ' ' + user.lastName + '} ' + DEFAULT_VALUES.notificationMessage.SUCCESSFULLY_JOIN_A_TEAM + ' {' + team.companyName +'}',
                  userId: team.id
                })
              }
            }
            if(notification.type === DEFAULT_VALUES.notificationType.EMAIL){
              //create in-app notification
              if(notification.inviteRequest === true){
                let message = +'{'+ user.firstName + ' ' + user.lastName + '} ' + DEFAULT_VALUES.notificationMessage.SUCCESSFULLY_JOIN_A_TEAM + ' {' + team.companyName +'}';
                sendJoinMail(team.email, message )
                // sendJoinTeamMail(user, team,)
              
              }
            }

        })

      }else{
        throw new NotFound('you cannot join your own team');
      }

    }else{
      throw new NotFound('team not found');
    }
  }
  return context
}

const createUsersDefaultSetup = async (context: any)=>{
  console.log(context.data.action)
  if(context.data.action === DEFAULT_VALUES.users.FORGOT_PASSWORD || context.data.action === DEFAULT_VALUES.users.RESET_PASSWORD){
    return context
  }
    //notifications  settings
    await app.services['notification-settings'].create({
      userId: context.result.id,
      type: DEFAULT_VALUES.notificationType.APP
    })
    await app.services['notification-settings'].create({
      userId: context.result.id,
      type: DEFAULT_VALUES.notificationType.EMAIL
    })
    //send mail
    await app.services.notification.create({ userId: context.result.id,
      message:`Hi ${context.result.firstName}, Welcome to Paperdaz, Let make the world safe with digital paper `
    })

    //jwt token
    const secret = await app.get('authentication').secret
    const token = jwt.sign({
      data: {
        user_id: context.result.id,
        firstName: context.result.firstName,
        lastName: context.result.lastName,
        package: context.data.package ?? null   
      }
    }, secret);
    await sendRegistrationEmail(context.result, token)
    return context 
}

const socialSignup = async (context: any)=>{
    if(context.data.isSocial === true){
      const secret = uuidv4()
      context.data.secret = secret 
      context.data.password = secret + context.data.socialId
      context.data.isEmailVerified = true
    }
    return context
}

const joinAdmin = async (context: any)=>{
    if(context.data.action === 'join_admin'){
      context.data.role = DEFAULT_VALUES.users.roles.ADMIN
      context.data.status = DEFAULT_VALUES.users.status.PENDING
    }
    return context
}



const forgotPassword = async (context: any)=>{
  if(context.data.action === DEFAULT_VALUES.users.FORGOT_PASSWORD){
    //generate forgotPassword token
    const user:any = await app.services.users.find({query:{email: context.data.email}})
      if(user.total === 0){
        throw new NotFound('user does not exist')
      }
      const secret = await app.get('authentication').secret
      const token = jwt.sign({
        data: user.data[0].id
      }, secret, { expiresIn: 10 * 60 });

      //sendforgot password email

      let link = app.get('app_url')+`/reset-password/?token=${token}`
      if(user.data[0].role === DEFAULT_VALUES.users.roles.SUPER_ADMIN){
        link = app.get('admin_url')+`/reset-password/?token=${token}`
      }
      sendForgotPassword(user.data[0], link)
      context.result = {message:"reset token sent to " + context.data.email, token}
      return context 
    }

  } 
 
const resetPassword = async (context: any)=>{
    if(context.data.action === DEFAULT_VALUES.users.RESET_PASSWORD){
      const secret = await app.get('authentication').secret
      let user_id = ''
      jwt.verify(context.data.token, secret, async function(err:any, decoded:any) {
        if(err){
          throw new NotFound('invalid or expied token')
        }
        user_id = decoded.data // bar
      });
      
      await app.services.users.patch(user_id, {password:context.data.newPassword, isEmailVerified: true})
      context.result = "reset successfully"
    }
    return context
}

const updatePassword = async (context: any)=>{
  if(context.data.isUpdatePassword === true){
    const user:any = await app.services.users.get(context?.id)
        const result:any = await bcrypt.compare(context.data.oldPassword, user.password);
        if (result == false) {
          throw new NotFound("Current password is incorrect")
        }
      }
    return context; 
}

export default {
  before: {
    all: [ ],
    find: [],
    get: [authenticate('jwt') ],
    create: [ forgotPassword, addReferralCode, joinATeam, socialSignup, hashPassword('password')],
    update: [hashPassword('password')],
    patch: [  joinAdmin, resetPassword, updatePassword, hashPassword('password')],
    remove: []
  },

  after: {
    all: [protect('password')],
    find: [],
    get: [],
    create: [rewardReferralCredit, createUsersDefaultSetup],
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
