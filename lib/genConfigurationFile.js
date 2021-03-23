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
      env: { dev: { space: false, catalog: 'catalogName', organization: 'organizationName', server: 'Exampleserver.com' } },
    },
  };

  const fillConfigurationSelect = new Select(questions.fiilConfiguration);
  const fillConfiguration = await fillConfigurationSelect.run();

  if (fillConfiguration === 'Yes') {
    let { productName, productVersion, ApiName, ApiVersion, catalog, organization, space, apiKey, password, username, server } = await prompt(questions.configurationDetails);
    conf.configuration = {
      product: { name: productName, version: productVersion },
      api: { name: ApiName, version: ApiVersion },
      env: { dev: { space: space != '' ? space : false, catalog: catalog, organization: organization, server: server } },
    };

    if (apiKey != '') {
      conf.configuration.env.dev.apiKey = apiKey;
    } else {
      conf.configuration.env.dev.username = username;
      conf.configuration.env.dev.password = password;
    }
  }

  const yamlConf = yaml.dump(conf, {});
  fs.writeFileSync('configuration.yaml', yamlConf, 'utf8');
};

module.exports = genConfigurationFile;
