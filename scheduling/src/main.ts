import crypto from 'crypto';
import { Server } from 'socket.io';
import { env } from './env';
import { Base, Gamess } from './jobs';

const io = new Server();

const isValidToken = (token: string): boolean => {
  if (token === env.apiKey) {
    return true;
  } else {
    return false;
  }
};
io.use((socket, next) => {
  const token = socket.handshake.auth['token'] as unknown;
  if (typeof token === 'string' && isValidToken(token)) {
    return next();
  }
  return next(new Error('authentication error'));
});

io.on('connection', (socket) => {
  const jobs = new Map<string, Base>();
  socket.on(
    'start',
    async (
      calcType: string,
      input: Record<string, string>,
      cb: (id?: string, err?: string) => void
    ) => {
      if (typeof cb !== 'function') return;
      if (typeof calcType !== 'string') {
        cb(undefined, 'calcType must be string');
        return;
      }
      if (
        typeof input !== 'object' ||
        !Object.values(input).every((i) => typeof i === 'string')
      ) {
        cb(undefined, 'inputs must be string');
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
      cb(id);
      await calc.start().catch((e) => console.error(e));
      socket.emit('end', id, await calc.getOutput());
      jobs.delete(id);
    }
  );

  socket.on('cancel', async (id: string) => {
    await jobs.get(id)?.cancel();
  });

  socket.on('disconnect', async () => {
    for (const job of jobs.values()) {
      await job.cancel();
    }
  });
});

io.listen(3000);
