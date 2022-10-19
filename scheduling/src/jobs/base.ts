import fs from 'fs/promises';
import path from 'path';
import type { Socket } from 'socket.io';
import { env } from '../env';

export class InvalidInputError extends Error {
  public constructor(filename: string) {
    super(
      `Required input file ${filename} is missing or its type is not string`
    );
  }
}

export default abstract class BaseJobExecuter<
  InputFiles extends Record<string, boolean> = Record<string, boolean>,
  OutputFiles extends readonly string[] = readonly string[]
> {
  protected abstract readonly inputFiles: InputFiles;
  protected abstract readonly outputFiles: OutputFiles;
  public constructor(public uniqueId: string, public socket: Socket) {
    socket.on('cancel', async () => this.cancel());
  }
  public async setInput(input: Map<keyof InputFiles, string>): Promise<void> {
    await fs.mkdir(`${this.filepath}`);
    for (const [filename, required] of Object.entries(this.inputFiles)) {
      if (required && typeof input.get(filename) !== 'string') {
        throw new InvalidInputError(filename);
      }
    }
    for (const filename of Object.keys(this.inputFiles)) {
      const content = input.get(filename);
      if (content) {
        await fs.writeFile(`${this.filepath}/${filename}`, content);
      }
    }
  }
  public abstract start(): Promise<void>;
  public abstract cancel(): Promise<void> | void;
  public async reportOutput(): Promise<void> {
    const result = await Promise.all(
      this.outputFiles.map<Promise<[string, string | undefined]>>(
        async (filename) => {
          const content = await fs
            .readFile(`${this.filepath}/${filename}`, {
              encoding: 'utf-8',
            })
            .catch(() => undefined);
          console.log(filename, content)
          return [filename, content];
        }
      )
    );
    this.socket.emit('end', this.uniqueId, Object.fromEntries(result));
    await fs.rm(`${this.filepath}`, { recursive: true, force: true })
  }

  protected get filepath(): string {
    return path.join(env.temporaryDirectory, this.uniqueId)
  }
}
