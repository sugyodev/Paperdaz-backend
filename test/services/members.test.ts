import assert from 'assert';
import app from '../../src/app';

describe('\'members\' service', () => {
  it('registered the service', () => {
    const service = app.service('members');

    assert.ok(service, 'Registered the service');
  });
});
