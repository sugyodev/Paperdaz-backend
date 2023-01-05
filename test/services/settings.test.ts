import assert from 'assert';
import app from '../../src/app';

describe('\'settings\' service', () => {
  it('registered the service', () => {
    const service = app.service('settings');

    assert.ok(service, 'Registered the service');
  });
});
