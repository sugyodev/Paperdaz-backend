// Initializes the `notificationSettings` service on path `/notification-settings`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { NotificationSettings } from './notification-settings.class';
import createModel from '../../models/notification-settings.model';
import hooks from './notification-settings.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'notification-settings': NotificationSettings & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/notification-settings', new NotificationSettings(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('notification-settings');

  service.hooks(hooks);
}
