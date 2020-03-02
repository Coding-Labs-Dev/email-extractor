import path from 'path';
import { listModels } from 'sequelize-test-helpers';

describe('List Models', () => {
  const models = listModels(
    path.resolve(process.cwd(), 'src', 'app', 'models'),
    'ts',
  );

  it('should have a Contact Model', () => {
    expect(models).toContain('Contact.');
  });

  it('should have a Template Model', () => {
    expect(models).toContain('Template.');
  });

  it('should have a Emails Model', () => {
    expect(models).toContain('Emails.');
  });
});
