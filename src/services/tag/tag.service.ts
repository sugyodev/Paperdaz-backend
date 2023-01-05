// Initializes the `tags` service on path `/tags`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Tag } from './tag.class';
import createModel from '../../models/tag.model';
import hooks from './tag.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'tag': Tag & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/tag', new Tag(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('tag');

  service.hooks(hooks);
}
