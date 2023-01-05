// Initializes the `cards` service on path `/cards`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Cards } from './cards.class';
import createModel from '../../models/cards.model';
import hooks from './cards.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'cards': Cards & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/cards', new Cards(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('cards');

  service.hooks(hooks);
}
