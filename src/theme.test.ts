import { theme } from './theme';

describe('theme', () => {
  it('exports a theme', () => {
    expect(theme).toBeDefined();
    expect(theme).instanceOf(Object);
  });
});
