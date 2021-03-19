const shell = require('shelljs');
const fs = require('fs');
const homedir = require('os').homedir();

const skipAprove = () => {
  const licensePath = `${homedir}/.apiconnect/.license-accepted`;
  const configPath = `${homedir}/.apiconnect/config`;
  const pluginsPath = `${homedir}/.apiconnect/plugins`;
  const exist = fs.existsSync(configPath);
  if (!exist) {
    shell.mkdir('-p', pluginsPath);
    fs.writeFileSync(licensePath, '1615058418008');
    fs.writeFileSync(configPath, "enable-analytics: false \nanalytics-reminder: '2121-02-07T23:15:22+02:00'");
  }
};

module.exports = skipAprove;
