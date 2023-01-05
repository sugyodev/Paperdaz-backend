// Initializes the `daily_activies` service on path `/daily-activies`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { DailyActivies } from './daily_activies.class';
import createModel from '../../models/daily_activies.model';
import hooks from './daily_activies.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'daily-activies': DailyActivies & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/daily-activies', new DailyActivies(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('daily-activies');

  service.hooks(hooks);
}
