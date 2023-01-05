import assert from 'assert';
import app from '../../src/app';

describe('\'verify\' service', () => {
  it('registered the service', () => {
    const service = app.service('verify');

    assert.ok(service, 'Registered the service');
  });
});
