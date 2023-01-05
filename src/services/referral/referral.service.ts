// Initializes the `referral` service on path `/referral`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Referral } from './referral.class';
import createModel from '../../models/referral.model';
import hooks from './referral.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'referral': Referral & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/referral', new Referral(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('referral');

  service.hooks(hooks);
}
