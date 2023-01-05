import assert from 'assert';
import app from '../../src/app';

describe('\'filetags\' service', () => {
  it('registered the service', () => {
    const service = app.service('filetags');

    assert.ok(service, 'Registered the service');
  });
});
