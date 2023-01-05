import assert from 'assert';
import app from '../../src/app';

describe('\'dashboard\' service', () => {
  it('registered the service', () => {
    const service = app.service('dashboard');

    assert.ok(service, 'Registered the service');
  });
});
