import fs from 'fs/promises';
import { exec } from 'child_process';
import BaseJobExecuter from './base';

const inputFiles = { 'gms.inp': true };
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
    const { signal } = this.controller;
    const proc = await new Promise<{ error: string, stdout: string, stderr: string }>((resolve) => {
      exec(
        `docker run --rm -v workspace:/home/gamess gamess:latest ./rungms-dev /home/gamess/${this.uniqueId}/gms.inp 00 4`,
        { signal },
        (error, stdout, stderr) => {
          console.log(error)
          resolve({
            error: String(error),
            stdout,
            stderr
          })
        }
      )
    })
    await fs.writeFile(`${this.filepath}/stdout`, proc.stdout);
    await fs.writeFile(`${this.filepath}/stderr`, proc.stderr);
  }
  public cancel(): void {
    this.controller?.abort();
  }
}
