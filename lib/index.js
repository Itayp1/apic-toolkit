const { Select } = require('enquirer');
const questions = require('./questions.json');
const { goodbye_msg, cant_find_operation } = require('./messages');
const argv = require('yargs')(process.argv.slice(2)).argv;
const { version } = require('../package.json');
const { scripts2Yaml, yaml2Scripts, findYaml } = require('./yamlOperations');
const publish = require('./publish');
const login = require('./login');
const promote = require('./promote');
const skipAprove = require('./skipAprove');

const genConfigurationFile = require('./genConfigurationFile');

const chooseOperation = new Select(questions.chooseOperation);
const start = async () => {
  const operation = process.argv.length === 2 ? await chooseOperation.run() : argv.operation || argv.v || '';
  const enviroment = argv.env || 'dev';
  let fileName;
  skipAprove();

  switch (operation.toString().toLowerCase()) {
    case 'yaml2scripts':
      fileName = await findYaml();
      yaml2Scripts(fileName);
      break;
    case 'scripts2yaml':
      fileName = await findYaml();
      scripts2Yaml(fileName);
      break;
    case 'publish':
      publish(enviroment);
      break;
    case 'login':
      login(enviroment);
      break;
    case 'generate configuration file':
      genConfigurationFile();
      break;
    case 'promote':
      const { to } = argv;
      promote(enviroment, to);
      break;
    case 'true':
      console.log(version);
      break;
    default:
      cant_find_operation(operation);
      process.exit(1);

      break;
  }
};
start();

process
  .on('unhandledRejection', (reason) => {
    if (reason.message) {
      console.log(reason.message);
    } else {
      goodbye_msg();
    }
    process.exit(1);
  })
  .on('uncaughtException', (err) => {
    if (err.message) {
      console.log(err.message);
    } else {
      goodbye_msg();
    }
    process.exit(1);
  })
  .on('SIGINT', () => {
    console.log('SIGINT');

    process.exit(0);
  });
