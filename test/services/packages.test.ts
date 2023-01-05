import assert from 'assert';
import app from '../../src/app';

describe('\'packages\' service', () => {
  it('registered the service', () => {
    const service = app.service('packages');

    assert.ok(service, 'Registered the service');
  });
});
