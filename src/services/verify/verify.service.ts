// Initializes the `verify` service on path `/verify`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Verify } from './verify.class';
import createModel from '../../models/verify.model';
import hooks from './verify.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'verify': Verify & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/verify', new Verify(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('verify');

  service.hooks(hooks);
}
