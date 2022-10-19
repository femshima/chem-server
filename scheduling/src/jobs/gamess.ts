import fs from 'fs/promises';
import { exec } from 'child_process';
import BaseJobExecuter from './base';

const inputFiles = { 'gms.inp': true };
const outputFiles = ['gms.out', 'gms.dat'] as const;

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
    await new Promise<{ error: string; stdout: string; stderr: string }>(
      (resolve) => {
        exec(
          `docker run --rm -v workspace:/home/gamess gamess:latest ${this.uniqueId}`,
          { signal },
          (error, stdout, stderr) => {
            console.log(error);
            resolve({
              error: String(error),
              stdout,
              stderr,
            });
          }
        );
      }
    );
  }
  public cancel(): void {
    this.controller?.abort();
  }
}
