#!/usr/bin/env node
const commander = require('commander');
const initAction = require('./commands/init')

// 版本号
commander
  .version(require('./package.json').version)
  .option('-v,--version', '查看版本号');

// 新建项目
commander
  .command('init test')
  .option('-d, --dev', '获取开发版')
  .description('创建项目')
  .action(initAction)
   
// 解析函数必须放在最后不是很合逻辑吗？
commander.parse(process.argv);
