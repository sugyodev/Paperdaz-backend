// Initializes the `test` service on path `/test`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Test } from './test.class';
import createModel from '../../models/test.model';
import hooks from './test.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'test': Test & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/test', new Test(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('test');

  service.hooks(hooks);
}
