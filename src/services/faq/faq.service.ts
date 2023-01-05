// Initializes the `faq` service on path `/faq`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Faq } from './faq.class';
import createModel from '../../models/faq.model';
import hooks from './faq.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'faq': Faq & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/faq', new Faq(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('faq');

  service.hooks(hooks);
}
