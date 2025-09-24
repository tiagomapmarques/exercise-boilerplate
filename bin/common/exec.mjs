import { exec } from 'node:child_process';

/** Executes the `exec` function, returning a Promise with the output that can be awaited. */
export const execAsync = (command) => {
  return new Promise((resolve) => {
    exec(command, (_error, stdout) => resolve(stdout));
  });
};
