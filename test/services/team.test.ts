import assert from 'assert';
import app from '../../src/app';

describe('\'team\' service', () => {
  it('registered the service', () => {
    const service = app.service('team');

    assert.ok(service, 'Registered the service');
  });
});
