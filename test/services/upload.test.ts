import assert from 'assert';
import app from '../../src/app';

describe('\'upload\' service', () => {
  it('registered the service', () => {
    const service = app.service('y');

    assert.ok(service, 'Registered the service');
  });
});
