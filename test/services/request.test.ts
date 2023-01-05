import assert from 'assert';
import app from '../../src/app';

describe('\'request\' service', () => {
  it('registered the service', () => {
    const service = app.service('request');

    assert.ok(service, 'Registered the service');
  });
});
