const fs = require('fs');
const yaml = require('js-yaml');
const { notFoundConf_msg, bad_format_msg, operation_finished, please_wait_publishing } = require('./messages');
const { scripts2Yaml, findYaml } = require('./yamlOperations');
const { execSync } = require('child_process');

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
      please_wait_publishing();
      const pushCommand = `apic drafts:push ${fileName} --organization ${env.local.organization} --server=${env.local.server}`;
      console.log(`pushCommand ${pushCommand} \nLoading`);
      let outppushCommandResult = execSync(pushCommand).toString('utf8');
      console.log(`outppushCommandResult ${outppushCommandResult}`);
      const publishCommand = `apic drafts:publish ${product.name}:${product.version}  --catalog ${env.local.catalog} --organization ${env.local.organization} --server=${env.local.server}      ${env.local.stage ? `--scope space --space ${env.local.stage}` : ''}`;
      console.log(`publishCommand ${publishCommand} \nLoading`);
      const publishCommandResult = execSync(publishCommand).toString('utf8');
      console.log(`publishCommandResult ${publishCommandResult}`);
      operation_finished();
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
