import assert from 'assert';
import app from '../../src/app';

describe('\'referral\' service', () => {
  it('registered the service', () => {
    const service = app.service('referral');

    assert.ok(service, 'Registered the service');
  });
});
