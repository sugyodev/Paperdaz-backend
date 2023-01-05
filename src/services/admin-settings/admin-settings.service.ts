// Initializes the `adminSettings` service on path `/admin-settings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { AdminSettings } from './admin-settings.class';
import createModel from '../../models/admin-settings.model';
import hooks from './admin-settings.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'admin-settings': AdminSettings & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
  };

  // Initialize our service with any options it requires
  app.use('/admin-settings', new AdminSettings(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('admin-settings');

  service.hooks(hooks);
}
