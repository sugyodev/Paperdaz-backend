import assert from 'assert';
import app from '../../src/app';

describe('\'features\' service', () => {
  it('registered the service', () => {
    const service = app.service('features');

    assert.ok(service, 'Registered the service');
  });
});
