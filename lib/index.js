const fs = require('fs');
const { Select } = require('enquirer');
const questions = require('./questions.json');
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
  files.length == 1 ? (fileName = files[0]) : (fileName = await chooseYamlFile(files).run());

  switch (operation) {
    case 'yaml2scripts':
      yaml2Scripts('./example2.yaml');
      break;
    case 'scripts2yaml':
      scripts2Yaml(fileName);
      break;

    default:
      break;
  }
};
start();
