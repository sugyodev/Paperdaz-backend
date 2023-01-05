import assert from 'assert';
import app from '../../src/app';

describe('\'subscriptions\' service', () => {
  it('registered the service', () => {
    const service = app.service('subscriptions');

    assert.ok(service, 'Registered the service');
  });
});
