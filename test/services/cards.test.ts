import assert from 'assert';
import app from '../../src/app';

describe('\'cards\' service', () => {
  it('registered the service', () => {
    const service = app.service('cards');

    assert.ok(service, 'Registered the service');
  });
});
