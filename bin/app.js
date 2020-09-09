#! /usr/bin/env node

const inquirer = require('inquirer');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs-extra'));
const program = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const download = require('download-git-repo');

const _v = require('../package.json').version;

program
  /* .command('module')
  .alias('m') */
  .version(_v)
  .usage('evel-react-cli name')
  .parse(process.argv)
  
const _initTemplateFile = __dirname.replace('\/bin', '\/template');

const _targetFileDest = process.cwd() + `/${program.args[0]}`;

// init start
function generator() {
  if (!program.args[0]) {
    console.log(chalk.red('\n file directory is required!'));
    console.log(chalk.red('\n run $ evel-react-cli dirname \n'));
    return;
  } else if (is_dir_file_exist(_targetFileDest)) {
    inquireForCopyFile();
    return;
  }
  // copyFile();
  downloadFileFromGithub();
}
generator();

// template download
function copyFile() {
  const spinner = ora("copy file is progressing......").start();
  spinner.color = 'green';
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
      // copyFile();
      downloadFileFromGithub();
    }
  })
}

// dowload file from github
function downloadFileFromGithub() {
  const spinner = ora("正在初始化项目...\n").start();
  spinner.color = 'green';
  // github is must public
  download('github:EvalGitHub/evel_react_cli#master', './test', function(err) {
    if (err) {
      console.error(err);
      spinner.stop();
      return;
    }
    if (!err) {
      // editFile({ version: '1.1', projectName: 'test'});
      spinner.stop();
      console.log('项目模版初始化成功...\n');
      console.log(`\n cd ${program.args[0]}\n`);
      console.log(chalk.green('run $ npm install \n'));
    }
  })
}

// edit package.json file
function editFile({ version, projectName }) {
  // 读取文件
  fs.readFile(`${process.cwd()}/${projectName}/package.json`, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // 获取json数据并修改项目名称和版本号
    let _data = JSON.parse(data.toString())
    _data.name = projectName
    _data.version = version
    let str = JSON.stringify(_data, null, 4);
    // 写入文件
    fs.writeFile(`${process.cwd()}/${projectName}/package.json`, str, function (err) {
      if (err) {
        console.error(err);
        return;
      }
    })
  });
};