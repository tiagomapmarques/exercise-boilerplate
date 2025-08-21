import { I18n } from '@lingui/core';

// biome-ignore lint/style/noRestrictedImports: Testing only
import { getAppI18n } from './i18n';

describe(getAppI18n, () => {
  it('gets an I18n instance', () => {
    const i18n = getAppI18n();

    expect(i18n).toBeInstanceOf(I18n);
  });
});
