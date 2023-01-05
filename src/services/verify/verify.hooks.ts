import { NotFound } from '@feathersjs/errors';
import { HooksObject } from '@feathersjs/feathers';
import app from '../../app';
import jwt from 'jsonwebtoken'
import { sendRegistrationEmail } from '../../utils/email-sender/registration';





const resendToken = async(context: any) =>{
  if (context.data.action === 'resendToken'){
    let user:any = await app.services.users.find({query:{email: context.data.email}})
    if(user.total < 1){
       throw new NotFound('this email does not belong to a user')
    }

    console.log('here', context.data.action)

    const secret = await app.get('authentication').secret
    const token = jwt.sign({
      data: {
        user_id: user.data[0].id,
        firstName: user.data[0].firstName,
        lastName: user.data[0].lastName,
        package: context.data.package ?? null   
      }
    }, secret);
    await sendRegistrationEmail(user.data[0], token)
    context.result = 'verification link sent successfully'
  }
}

const verifyEmail = async(context: any) =>{
  if (context.data.action === 'verifyEmail'){
    if(!context.data.token){
      throw new NotFound('token not found')
    }

    const secret = await app.get('authentication').secret
    let id:any
    jwt.verify(context.data.token, secret, async function(err:any, decoded:any) {
      if(err){
        throw new NotFound('invalid or expired token')
      }
      id = decoded.data
    });
    const update = await app.services.users.patch(id, {isEmailVerified:true})
    context.result = update
  }
}






export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      // test
      resendToken,
      verifyEmail,
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
