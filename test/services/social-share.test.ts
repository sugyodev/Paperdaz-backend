import assert from 'assert';
import app from '../../src/app';

describe('\'socialShare\' service', () => {
  it('registered the service', () => {
    const service = app.service('social-share');

    assert.ok(service, 'Registered the service');
  });
});
