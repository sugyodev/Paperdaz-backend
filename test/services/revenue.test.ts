import assert from 'assert';
import app from '../../src/app';

describe('\'revenue\' service', () => {
  it('registered the service', () => {
    const service = app.service('revenue');

    assert.ok(service, 'Registered the service');
  });
});
