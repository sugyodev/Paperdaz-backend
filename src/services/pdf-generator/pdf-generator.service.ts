// Initializes the `pdfGenerator` service on path `/pdf-generator`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { PdfGenerator } from './pdf-generator.class';
import createModel from '../../models/pdf-generator.model';
import hooks from './pdf-generator.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'pdf-generator': PdfGenerator & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    // paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/pdf-generator', new PdfGenerator(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('pdf-generator');

  service.hooks(hooks);
}
