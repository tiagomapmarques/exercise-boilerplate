import { setupI18n } from '@lingui/core';

const appI18n = setupI18n();

/** Gets the i18n instance for the app. */
export const getAppI18n = () => appI18n;
