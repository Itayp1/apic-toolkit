const fs = require('fs');
const yaml = require('js-yaml');
const { Select, prompt } = require('enquirer');
const questions = require('./questions.json');

const { consf_already_exist } = require('../lib/messages');

const genConfigurationFile = async () => {
  const exist = fs.existsSync('./configuration.yaml');
  if (exist) {
    consf_already_exist();
    process.exit(0);
  }

  const conf = {
    configuration: {
      product: { name: 'productName', version: '1.0.0' },
      api: { name: 'apiName', version: '1.0.0' },
      env: { dev: { stage: false, catalog: 'catalogName', organization: 'organizationName', server: 'Exampleserver.com', apiKey: 'apiKey' } },
    },
  };

  const isDefaultSelect = new Select(questions.fiilConfiguration);
  const isDefault = await isDefaultSelect.run();

  if (isDefault) {
    let { productName, productVersion, ApiName, ApiVersion, catalog, organization, space, apiKey, server } = await prompt(questions.configurationDetails);
    conf.configuration = {
      product: { name: productName, version: productVersion },
      api: { name: ApiName, version: ApiVersion },
      env: { dev: { stage: space != '' ? space : false, catalog: catalog, organization: organization, server: server, apiKey: apiKey } },
    };
  }

  const yamlConf = yaml.dump(conf, {});
  fs.writeFileSync('configuration.yaml', yamlConf, 'utf8');
};

module.exports = genConfigurationFile;