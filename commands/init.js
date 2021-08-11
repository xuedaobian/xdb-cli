const shell = require('shelljs');
// const symbols = require('log-symbols');
const clone = require('../utils/clone.js');
// 模板库地址
const remote = 'https://github.com/xuedaobian/xdb-cli'; 
const fs = require('fs');
const inquirer = require('inquirer');
let branch = 'main';

const initAction = async (name, option) => {
  // 0. 检查控制台是否可以运行`git `，
  if (!shell.which('git')) {
    console.log('对不起，git命令不可用！');
    // console.log(symbols.error, '对不起，git命令不可用！');
    shell.exit(1);
  }
  // 1. 验证输入name是否合法
  if (fs.existsSync(name)) {
    console.log( `已存在项目文件夹${name}！`);
    // console.log(symbols.warning, `已存在项目文件夹${name}！`);
    return;
  }
  if (name.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) {
    console.log( '项目名称存在非法字符！');
    // console.log(symbols.error, '项目名称存在非法字符！');
    return;
  }
  // 2. 获取option，确定模板类型（分支）
  if (option.dev) branch = 'develop';
  // 3. 个性化配置
  const questions = [
    {
      type: 'input',
      message: '请输入模板名称:',
      name: 'name',
      validate(val) {
        if (!val) return '模板名称不能为空！';
        if (val.match(/[^A-Za-z0-9\u4e00-\u9fa5_-]/g)) return '模板名称包含非法字符，请重新输入';
        return true;
      }
    },
    {
      type: 'input',
      message: '请输入模板关键词（;分割）:',
      name: 'keywords'
    },
    {
      type: 'input',
      message: '请输入模板简介:',
      name: 'description'
    },
    {
      type: 'list',
      message: '请选择模板类型:',
      choices: ['响应式', '桌面端', '移动端'],
      name: 'type'
    },
    {
      type: 'list',
      message: '请选择模板分类:',
      choices: ['整站', '单页', '专题'],
      name: 'category'
    },
    {
      type: 'input',
      message: '请输入模板风格:',
      name: 'style'
    },
    {
      type: 'input',
      message: '请输入模板色系:',
      name: 'color'
    },
    {
      type: 'input',
      message: '请输入您的名字:',
      name: 'author'
    }
  ];
  // 通过inquirer获取到用户输入的内容
  const answers = await inquirer.prompt(questions);
  // 将用户的配置打印，确认一下是否正确
  console.log('------------------------');
  console.log(answers);
  let confirm = await inquirer.prompt([
    {
      type: 'confirm',
      message: '确认创建？',
      default: 'Y',
      name: 'isConfirm'
    }
  ]);
  if (!confirm.isConfirm) return false;
  // 4. 下载模板
  await clone(`direct:${remote}#${branch}`, name, { clone: true });
  // 5. 切断与远程仓库的连接
  const deleteDir = ['.git', '.gitignore', 'README.md', 'docs']; // 需要清理的文件
  const pwd = shell.pwd();
  deleteDir.map(item => shell.rm('-rf', pwd + `/${name}/${item}`));
};

module.exports = initAction;