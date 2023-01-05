// Initializes the `revenue` service on path `/revenue`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Revenue } from './revenue.class';
import createModel from '../../models/revenue.model';
import hooks from './revenue.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'revenue': Revenue & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/revenue', new Revenue(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('revenue');

  service.hooks(hooks);
}
