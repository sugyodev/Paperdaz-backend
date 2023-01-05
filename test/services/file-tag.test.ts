import assert from 'assert';
import app from '../../src/app';

describe('\'fileTag\' service', () => {
  it('registered the service', () => {
    const service = app.service('file-tag');

    assert.ok(service, 'Registered the service');
  });
});
