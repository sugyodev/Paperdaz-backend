import assert from 'assert';
import app from '../../src/app';

describe('\'tags\' service', () => {
  it('registered the service', () => {
    const service = app.service('tags');

    assert.ok(service, 'Registered the service');
  });
});
