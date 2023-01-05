 // Initializes the `socialShare` service on path `/social-share`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { SocialShare } from './social-share.class';
import createModel from '../../models/social-share.model';
import hooks from './social-share.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'social-share': SocialShare & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/social-share', new SocialShare(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('social-share');

  service.hooks(hooks);
}
