// Initializes the `ledger` service on path `/ledger`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Ledger } from './ledger.class';
import createModel from '../../models/ledger.model';
import hooks from './ledger.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'ledger': Ledger & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/ledger', new Ledger(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('ledger');

  service.hooks(hooks);
}
