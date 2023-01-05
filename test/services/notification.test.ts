import assert from 'assert';
import app from '../../src/app';

describe('\'notification\' service', () => {
  it('registered the service', () => {
    const service = app.service('notification');

    assert.ok(service, 'Registered the service');
  });
});
