// Initializes the `packages` service on path `/packages`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Packages } from './packages.class';
import createModel from '../../models/packages.model';
import hooks from './packages.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'packages': Packages & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/packages', new Packages(options, app));


  // Get our initialized service so that we can register hooks
  const service = app.service('packages');

  service.hooks(hooks);

}
