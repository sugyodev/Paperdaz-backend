import assert from 'assert';
import app from '../../src/app';

describe('\'favourites\' service', () => {
  it('registered the service', () => {
    const service = app.service('favourites');

    assert.ok(service, 'Registered the service');
  });
});
