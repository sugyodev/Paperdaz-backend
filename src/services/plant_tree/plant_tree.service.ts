// Initializes the `plant_tree` service on path `/plant-tree`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { PlantTree } from './plant_tree.class';
import createModel from '../../models/plant_tree.model';
import hooks from './plant_tree.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'plant-tree': PlantTree & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/plant-tree', new PlantTree(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('plant-tree');

  service.hooks(hooks);
}
