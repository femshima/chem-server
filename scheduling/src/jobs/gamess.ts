import fs from 'fs/promises';
import { promisify } from 'util';
import { exec } from 'child_process';
import BaseJobExecuter from './base';

const inputFiles = { input: true };
const outputFiles = ['stdout', 'stderr', 'restart'] as const;

export default class Gamess extends BaseJobExecuter<
  typeof inputFiles,
  typeof outputFiles
> {
  protected inputFiles = inputFiles;
  protected outputFiles = outputFiles;
  private controller?: AbortController;
  public async start(): Promise<void> {
    this.controller = new AbortController();
    const proc = await promisify(exec)(
      `docker run -v /tmp/${this.uniqueId}:/home/gamess gamess:latest`,
      { signal: this.controller.signal }
    );
    await fs.writeFile(`/tmp/${this.uniqueId}/stdout`, proc.stdout);
    await fs.writeFile(`/tmp/${this.uniqueId}/stderr`, proc.stderr);
  }
  public cancel(): void {
    this.controller?.abort();
  }
}
