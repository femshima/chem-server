import readenv from '@cm-ayf/readenv';

/*if (process.env['NODE_ENV'] !== 'production')*/ (
  await import('dotenv')
).config();

/**
 * environment variables that are in use; always load from here
 */
export const env = readenv({
  apiEndpoint: {
    from: 'API_ENDPOINT',
    default: 'http://localhost:3000',
  },
  apiKey: {
    from: 'API_KEY',
  },
  production: {
    from: 'NODE_ENV',
    default: false,
    parse: (s) => s === 'production',
  },
});
