// Initializes the `invoices` service on path `/invoices`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Invoices } from './invoices.class';
import createModel from '../../models/invoices.model';
import hooks from './invoices.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'invoices': Invoices & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/invoices', new Invoices(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('invoices');

  service.hooks(hooks);
}
