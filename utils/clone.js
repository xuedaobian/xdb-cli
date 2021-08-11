const download = require('download-git-repo');
const ora = require('ora'); // 用于输出loading
const chalk = require('chalk'); // 用于改变文字颜色
module.exports = function (remote, name, option) {
  const downSpinner = ora('正在下载模板...').start();
  return new Promise((resolve, reject) => {
    download(remote, name, option, err => {
      if (err) {
        downSpinner.fail();
        console.log(chalk.red(err));
        reject(err);
        return;
      };
      downSpinner.succeed(chalk.green('模板下载成功！'));
      resolve();
    });
  });
};