import { theme } from './theme';

describe('theme', () => {
  test('exports a theme', () => {
    expect(theme).toBeDefined();
    expect(theme instanceof Object);
  });
});
