import assert from 'assert';
import app from '../../src/app';

describe('\'folders\' service', () => {
  it('registered the service', () => {
    const service = app.service('folders');

    assert.ok(service, 'Registered the service');
  });
});
