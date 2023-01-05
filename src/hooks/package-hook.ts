// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { BadRequest } from '@feathersjs/errors';
import { Hook, HookContext } from '@feathersjs/feathers';
import { DEFAULT_VALUES } from '../utils/constants';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {

    if(context.params.user?.role !== DEFAULT_VALUES.users.roles.SUPER_ADMIN){
       throw new BadRequest("unauthorized only admin can create packages")
    }
      context.data.isCreatedByAdmin = true;
      if(context.data.promoCode){
        context.data.type = DEFAULT_VALUES.packagesTypes.PROMOTION
        context.data.isPromotion = true;
      }else{
        context.data.type = DEFAULT_VALUES.packagesTypes.DEFAULT
      }


    console.log(context.data)
    return context;
  };
};
