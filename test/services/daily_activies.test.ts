import assert from 'assert';
import app from '../../src/app';

describe('\'daily_activies\' service', () => {
  it('registered the service', () => {
    const service = app.service('daily-activies');

    assert.ok(service, 'Registered the service');
  });
});
