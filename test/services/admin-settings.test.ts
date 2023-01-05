import assert from 'assert';
import app from '../../src/app';

describe('\'adminSettings\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin-settings');

    assert.ok(service, 'Registered the service');
  });
});
