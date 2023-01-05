// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    
    const sequelize = context.app.get('sequelizeClient');
    const { users, files} = sequelize.models;
    context.params.sequelize = {
      include: [
        { model: files, attributes: ['fileName','fileAction','paperLink','downloadLink', 'annotaions','filePrivacy' ] },
        { model: users, attributes: ['firstName','lastName','email','profile_picture','role' ] },
        { model: users, as: 'fileOwner', attributes: ['firstName','lastName','company_name','email','profile_picture','role' ] },
      ],
      raw: false,
    };

    return context;
  };
};
