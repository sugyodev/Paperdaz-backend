import assert from 'assert';
import app from '../../src/app';

describe('\'permissions\' service', () => {
  it('registered the service', () => {
    const service = app.service('permissions');

    assert.ok(service, 'Registered the service');
  });
});
