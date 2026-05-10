import { theme } from './theme';

describe('theme', () => {
  it('exports a theme', () => {
    expect(theme).toBeDefined();
    expect(theme).toBeInstanceOf(Object);
  });
});
