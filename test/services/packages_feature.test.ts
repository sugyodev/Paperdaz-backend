import assert from 'assert';
import app from '../../src/app';

describe('\'packages_feature\' service', () => {
  it('registered the service', () => {
    const service = app.service('packages-feature');

    assert.ok(service, 'Registered the service');
  });
});
