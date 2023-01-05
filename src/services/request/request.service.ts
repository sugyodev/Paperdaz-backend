// Initializes the `request` service on path `/request`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Request } from './request.class';
import createModel from '../../models/request.model';
import hooks from './request.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'request': Request & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/request', new Request(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('request');

  service.hooks(hooks);
}
