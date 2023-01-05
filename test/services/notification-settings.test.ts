import assert from 'assert';
import app from '../../src/app';

describe('\'notificationSettings\' service', () => {
  it('registered the service', () => {
    const service = app.service('notification-settings');

    assert.ok(service, 'Registered the service');
  });
});
