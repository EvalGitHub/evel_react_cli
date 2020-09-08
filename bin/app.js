#! /usr/bin/env node

const inquirer = require('inquirer')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs-extra'))
const program = require('commander')
const chalk = require('chalk')
const ora = require('ora');

const _v = require('../package.json').version;

program
  /* .command('module')
  .alias('m') */
  .version(_v)
  .usage('evel_react_cli name')
  .parse(process.argv)
  
const _initTemplateFile = __dirname.replace('\/bin', '\/template');

const _targetFileDest = process.cwd() + `/${program.args[0]}`;

function generator() {
  if (!program.args[0]) {
    console.log(chalk.red('\n file directory is required!'));
    console.log(chalk.red('\n run $ evel-react-cli dirname \n'));
    return;
  } else if (is_dir_file_exist(_targetFileDest)) {
    inquireForCopyFile();
    return;
  }
  copyFile();
}
generator();

// template download
function copyFile() {
  const spinner = ora("Image is compressing......").start();
  fs.copy(_initTemplateFile, _targetFileDest)
    .then(() => {
      spinner.stop();
      console.log(`\n cd ${program.args[0]}\n`);
      console.log(chalk.green('run $ npm install \n'));
    })
    .catch(err => console.log(chalk.red(`something error, try again!!...`)))
}

// file exist already notice
function is_dir_file_exist(path) {
  try {
    fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
    console.log('\n？文件已经存在...\n');
    return true;
  } catch (err) {
    return false;
  }
}

// inquire for user action
function inquireForCopyFile() {
  let promps = [
    {
      type: 'confirm',
      name: 'coverFile',
      message: '是否覆盖文件继续操作？',
    }
  ];
  inquirer.prompt(promps).then(function (answers) {
    if (answers.coverFile) { // 如果yes
      copyFile();
    }
  })
}