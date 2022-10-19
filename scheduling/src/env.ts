import readenv from '@cm-ayf/readenv';

if (process.env['NODE_ENV'] !== 'production') (await import('dotenv')).config();

/**
 * environment variables that are in use; always load from here
 */
export const env = readenv({
  mongoConnectionString: {
    from: 'MONGO_CONNECTION_STRING',
  },
  temporaryDirectory: {
    from: 'TEMP_DIR',
    default: '/tmp',
  },
  production: {
    from: 'NODE_ENV',
    default: false,
    parse: (s) => s === 'production',
  },
});
