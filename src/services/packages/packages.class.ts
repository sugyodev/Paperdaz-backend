import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';

export class Packages extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, app: Application) {
    super(options);
  }

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  // async find( params?: any): Promise<any> {
  //   if(params?.query.code) {
  //     return params?.query.code
  //   }
  // }

}
