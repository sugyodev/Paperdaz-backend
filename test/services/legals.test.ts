import assert from 'assert';
import app from '../../src/app';

describe('\'legals\' service', () => {
  it('registered the service', () => {
    const service = app.service('legals');

    assert.ok(service, 'Registered the service');
  });
});
