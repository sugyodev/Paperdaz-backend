import assert from 'assert';
import app from '../../src/app';

describe('\'files\' service', () => {
  it('registered the service', () => {
    const service = app.service('files');

    assert.ok(service, 'Registered the service');
  });
});
