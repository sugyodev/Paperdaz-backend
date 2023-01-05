// Initializes the `customer_support` service on path `/customer-support`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CustomerSupport } from './customer_support.class';
import createModel from '../../models/customer_support.model';
import hooks from './customer_support.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'customer-support': CustomerSupport & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/customer-support', new CustomerSupport(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('customer-support');

  service.hooks(hooks);
}
