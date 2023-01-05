import assert from 'assert';
import app from '../../src/app';

describe('\'ledger\' service', () => {
  it('registered the service', () => {
    const service = app.service('ledger');

    assert.ok(service, 'Registered the service');
  });
});
