const { Select } = require('enquirer');
const questions = require('./questions.json');
const { goodbye_msg, notFound_msg } = require('./messages');
const argv = require('yargs')(process.argv.slice(2)).argv;

const { scripts2Yaml, yaml2Scripts, findYaml } = require('./yamlOperations');
const publish = require('./publish');
const login = require('./login');
const genConfigurationFile = require('./genConfigurationFile');

const chooseOperation = new Select(questions.chooseOperation);

const start = async () => {
  const operation = process.argv.length === 2 ? await chooseOperation.run() : argv.operation;
  const enviroment = argv.env || 'local';
  let fileName;
  switch (operation) {
    case 'Yaml2scripts':
      fileName = await findYaml();
      yaml2Scripts(fileName);
      break;
    case 'Scripts2yaml':
      fileName = await findYaml();
      scripts2Yaml(fileName);
      break;
    case 'Publish':
      publish(enviroment);
      break;
    case 'Login':
      login(enviroment);
      break;
    case 'Generate Configuration File':
      genConfigurationFile();
      break;

    default:
      notFound_msg();
      process.exit(0);

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
    process.exit(0);
  })
  .on('uncaughtException', (err) => {
    if (err.message) {
      console.log(err.message);
    } else {
      goodbye_msg();
    }
    process.exit(0);
  })
  .on('SIGINT', () => {
    console.log('SIGINT');

    process.exit();
  });
