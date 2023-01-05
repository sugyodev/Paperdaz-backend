import assert from 'assert';
import app from '../../src/app';

describe('\'pdfGenerator\' service', () => {
  it('registered the service', () => {
    const service = app.service('pdf-generator');

    assert.ok(service, 'Registered the service');
  });
});
