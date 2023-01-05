// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import app from '../app';
import { DEFAULT_VALUES } from '../utils/constants';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const adminSettings:any = await app.services['admin-settings'].find()

    if(context.data.type === DEFAULT_VALUES.referalType.PAYMENT){
      context.data.leavesEarned = adminSettings.filter((setting:any) => setting.name === DEFAULT_VALUES.adminSettings.REGISTRATION_LEAVES)[0] ? adminSettings.filter((setting:any) => setting.name === DEFAULT_VALUES.adminSettings.REGISTRATION_LEAVES)[0].value : 0
    }else if(context.data.type === DEFAULT_VALUES.referalType.REGISTERATION){
       context.data.creditEarned = adminSettings.filter((setting:any) => setting.name === DEFAULT_VALUES.adminSettings.REFERRAL_CREDIT)[0] ? adminSettings.filter((setting:any) => setting.name === DEFAULT_VALUES.adminSettings.REFERRAL_CREDIT)[0].value : 0
    }
    return context;
  };
};
