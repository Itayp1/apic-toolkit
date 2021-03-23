const { operation_finished, please_wait_publishing, publishing_err, cant_find_enviorment } = require('./messages');
const { scripts2Yaml, findYaml } = require('./yamlOperations');
const { execSync } = require('child_process');
const parseConfiguration = require('../util/parseConfiguration');

const publish = async (enviorment) => {
  const { product, env } = parseConfiguration();
  if (!product || !env || !env[enviorment]) {
    cant_find_enviorment(enviorment);
    process.exit(0);
  }
  const { server, organization, catalog, space } = env[enviorment];
  try {
    const fileName = await findYaml();
    scripts2Yaml(fileName);
    please_wait_publishing();
    const pushCommand = `apic drafts:push ${fileName} --organization ${organization} --server=${server}`;
    console.log(`pushCommand ${pushCommand} \nLoading`);
    let outppushCommandResult = execSync(pushCommand).toString('utf8');
    console.log(`outppushCommandResult ${outppushCommandResult}`);
    const publishCommand = `apic drafts:publish ${product.name}:${product.version}  --catalog ${catalog} --organization ${organization} --server=${server}      ${space ? `--scope space --space ${space}` : ''}`;
    console.log(`publishCommand ${publishCommand} \nLoading`);
    const publishCommandResult = execSync(publishCommand).toString('utf8');
    console.log(`publishCommandResult ${publishCommandResult}`);
    operation_finished();
  } catch (error) {
    const err = error.stdout ? error.stdout.toString('utf8') : error.message;
    publishing_err(err);

    process.exit(1);
  }
};

module.exports = publish;
