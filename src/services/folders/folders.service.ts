// Initializes the `folders` service on path `/folders`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Folders } from './folders.class';
import createModel from '../../models/folders.model';
import hooks from './folders.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'folders': Folders & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/folders', new Folders(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('folders');

  service.hooks(hooks);
}
