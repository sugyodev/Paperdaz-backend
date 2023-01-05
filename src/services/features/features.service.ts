// Initializes the `features` service on path `/features`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Features } from './features.class';
import createModel from '../../models/features.model';
import hooks from './features.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'features': Features & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/features', new Features(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('features');

  service.hooks(hooks);
}
