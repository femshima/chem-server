import Agenda, { Job } from 'agenda';
import { env } from './env';
import crypto from 'crypto';
import { Server } from 'socket.io';
import { Base, Gamess } from './jobs';

const agenda = new Agenda({ db: { address: env.mongoConnectionString } });

const io = new Server();

const jobs = new Map<string, Base>();

io.on('connection', (socket) => {
  socket.on(
    'start',
    async (
      calcType: string,
      input: Record<string, string>,
      cb: (id?: string, err?: string) => void
    ) => {
      if (typeof cb !== 'function') return;
      if (typeof calcType !== 'string') {
        cb(undefined, 'calcType must be string')
        return;
      }
      if (typeof input !== 'object' || !Object.values(input).every(i => typeof i === 'string')) {
        cb(undefined, 'inputs must be string')
        return;
      }
      const id = crypto.randomUUID();
      let calc: Base | undefined;
      switch (calcType) {
        case 'GAMESS':
          calc = new Gamess(id, socket);
      }

      try {
        if (!calc) throw new Error('Unknown calculation type');
        await calc.setInput(new Map(Object.entries(input)));
      } catch (e) {
        cb(id, String(e));
        return;
      }
      jobs.set(id, calc);
      cb(id)
      await agenda.now('exec', { id });
    }
  );

  socket.on('cancel', async (id: string) => {
    await jobs.get(id)?.cancel();
  });
});

agenda.define('exec', { concurrency: 1 }, async (job: Job<{ id?: string }>) => {
  const { id } = job.attrs.data ?? {};
  if (typeof id !== 'string') return;
  const calc = jobs.get(id)
  if (!calc) return;

  await calc.start().catch((e) => console.error(e));
  await calc.reportOutput();
});

await agenda.start();
io.listen(3000);
