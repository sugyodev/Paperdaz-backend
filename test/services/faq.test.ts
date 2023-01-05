import assert from 'assert';
import app from '../../src/app';

describe('\'faq\' service', () => {
  it('registered the service', () => {
    const service = app.service('faq');

    assert.ok(service, 'Registered the service');
  });
});
