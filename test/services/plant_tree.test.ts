import assert from 'assert';
import app from '../../src/app';

describe('\'plant_tree\' service', () => {
  it('registered the service', () => {
    const service = app.service('plant-tree');

    assert.ok(service, 'Registered the service');
  });
});
