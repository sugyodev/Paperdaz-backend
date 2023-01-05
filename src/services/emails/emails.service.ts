// Initializes the `emails` service on path `/emails`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Emails } from './emails.class';
import createModel from '../../models/emails.model';
import hooks from './emails.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'emails': Emails & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/emails', new Emails(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('emails');

  service.hooks(hooks);
}
