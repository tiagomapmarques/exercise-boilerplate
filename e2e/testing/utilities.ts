/** Whether the specs run against the development server rather than the production preview. */
export const isDevelopment = (baseUrl: string | undefined) => {
  return !baseUrl?.includes(':8080');
};
