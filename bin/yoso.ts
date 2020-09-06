#!/usr/bin/env node

import * as commander from 'commander';
import { CommanderStatic } from 'commander';

import { CommandLoader } from '../commands';


const bootstrap = () => {
  const program: CommanderStatic = commander;
  program.version(require('../package.json').version);
  CommandLoader.load(program);
  commander.parse(process.argv);
  program.outputHelp();
  if (!program.args.length) {
    program.outputHelp();
  }
}

bootstrap();