import * as chalk from 'chalk';

export const verbose = chalk.white;

export const status = chalk.cyan;

export const input = chalk.yellow;

export const comment = (chalk as any).keyword('pink');

export const info = chalk.green;

export const warning = chalk.yellow;

export const error = chalk.bgRed.white.bold;
