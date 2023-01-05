// Initializes the `filetags` service on path `/filetags`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Filetags } from './filetags.class';
import createModel from '../../models/filetags.model';
import hooks from './filetags.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'filetags': Filetags & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/filetags', new Filetags(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('filetags');

  service.hooks(hooks);
}
