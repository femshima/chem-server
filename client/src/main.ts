import { io } from 'socket.io-client';
import { env } from './env';
import fs from 'fs/promises';

const socket = io(env.apiEndpoint, {
  auth: {
    token: env.apiKey,
  },
});

const filepath = process.argv[2];
if (typeof filepath !== 'string')
  throw new Error('Please specify input file path');

socket.emit(
  'start',
  'GAMESS',
  {
    'gms.inp': await fs.readFile(filepath, { encoding: 'utf-8' }),
  },
  (id: string, err: string) => console.log(id, err)
);

socket.on(
  'end',
  async (id: string, res: Record<string, string | undefined>) => {
    console.log('Completed. id:', id);
    for (const [name, content] of Object.entries(res)) {
      if (typeof content === 'string') {
        await fs.writeFile(name, content);
      }
    }
    process.exit(0);
  }
);
