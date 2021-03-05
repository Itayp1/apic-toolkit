const fs = require('fs');
const yaml = require('js-yaml');
const { notFoundConf_msg, bad_format_msg } = require('./messages');
const { scripts2Yaml, yaml2Scripts, findYaml } = require('./yamlOperations');

const publish = async () => {
  try {
    const configurationYaml = fs.readFileSync('./configuration.yaml', 'utf8');

    try {
      const { configuration } = yaml.load(configurationYaml);
      if (!configuration) {
        bad_format_msg('configuration root element is missing from configuration.yaml');
        process.exit(0);
      }

      const {
        product,
        env: [env],
      } = configuration;
      const fileName = await findYaml();
      scripts2Yaml(fileName);

      console.log(`apic drafts:push ${fileName} --organization ${env.local.organization} --server=${env.local.server}`);
      console.log(`apic drafts:publish ${product.name}:${product.version}  --catalog ${env.local.catalog} --organization ${env.local.organization} --server=${env.local.server}      ${env.local.stage ? `--scope space --space ${env.local.stage}` : ''}`);
    } catch (error) {
      bad_format_msg(error.message);
      process.exit(0);
    }
  } catch (error) {
    notFoundConf_msg();
    process.exit(0);
  }
};

module.exports = publish;
