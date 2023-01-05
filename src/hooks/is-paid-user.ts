// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { DEFAULT_VALUES } from '../utils/constants';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    console.log(context.params)
    const {user} = context.params;
    if(user?.role === DEFAULT_VALUES.users.roles.PAID_USER){
      return context;
    }else{
      throw new Error (DEFAULT_VALUES.errorMessage.AUTHORIZED_PAID_USER);
    }
  };
};
