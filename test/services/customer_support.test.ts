import assert from 'assert';
import app from '../../src/app';

describe('\'customer_support\' service', () => {
  it('registered the service', () => {
    const service = app.service('customer-support');

    assert.ok(service, 'Registered the service');
  });
});
