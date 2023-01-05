// Initializes the `leaves` service on path `/leaves`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Leaves } from './leaves.class';
import createModel from '../../models/leaves.model';
import hooks from './leaves.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'leaves': Leaves & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/leaves', new Leaves(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('leaves');

  service.hooks(hooks);
}
