const fs = require('fs');
const { Select } = require('enquirer');
const questions = require('./questions.json');
const { goodbye_msg, notFound_msg } = require('./messages');

const { scripts2Yaml, yaml2Scripts } = require('./yamlOperations');
const chooseOperation = new Select(questions.chooseOperation);

const chooseYamlFile = (files) =>
  new Select({
    ...questions.chooseYamlFile,
    choices: files,
  });

const start = async () => {
  let fileName;
  const operation = await chooseOperation.run();
  const files = fs.readdirSync('./').filter((name) => name.includes('.yaml'));
  if (files.length == 0) {
    notFound_msg();
    process.exit(0);
  }

  files.length == 1 ? (fileName = files[0]) : (fileName = await chooseYamlFile(files).run());

  switch (operation) {
    case 'yaml2scripts':
      yaml2Scripts(fileName);
      break;
    case 'scripts2yaml':
      scripts2Yaml(fileName);
      break;

    default:
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
