const fs = require('fs');
const { Select } = require('enquirer');
const questions = require('./questions.json');
const { goodbye_msg, notFound_msg } = require('./messages');

const { scripts2Yaml, yaml2Scripts, findYaml } = require('./yamlOperations');
const publish = require('./publish');

const chooseOperation = new Select(questions.chooseOperation);

const start = async () => {
  const operation = process.argv[2] == undefined ? await chooseOperation.run() : process.argv[2];
  let fileName;
  switch (operation) {
    case 'yaml2scripts':
      fileName = await findYaml();
      yaml2Scripts(fileName);
      break;
    case 'scripts2yaml':
      fileName = await findYaml();
      scripts2Yaml(fileName);
      break;
    case 'publish':
      publish();
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
