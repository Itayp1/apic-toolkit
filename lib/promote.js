const { operation_finished, please_wait_publishing, publishing_err, cant_find_enviorment, general_msg } = require('./messages');
const { scripts2Yaml, findYaml } = require('./yamlOperations');
const { execSync } = require('child_process');
const parseConfiguration = require('../util/parseConfiguration');

const promote = async (enviorment, to) => {
  const { product, env, api } = parseConfiguration();

  if (!product || !env || !env[enviorment] || !to || !env[to]) {
    cant_find_enviorment(`env=${enviorment} to=${to}`);
    process.exit(0);
  }

  const from = env[enviorment];
  const dst = env[to];
  try {
    general_msg('START THE PROMOTE PROCESS');
    const pullProductCommand = `apic products:pull ${product.name}:${product.version} --organization ${from.organization} --server=${from.server}   ${from.space ? `--scope space --space ${from.space}` : ''} --catalog ${from.catalog} `;
    console.log(`pullProductCommand ${pullProductCommand} \nLoading`);
    let outpullProductCommandResult = execSync(pullProductCommand).toString('utf8');
    console.log(`outpullProductCommandResult ${outpullProductCommandResult}`);

    const pullApiCommand = `apic apis:pull ${api.name}:${api.version} --organization ${from.organization} --server=${from.server}   ${from.space ? `--scope space --space ${from.space}` : ''} --catalog ${from.catalog} `;
    console.log(`pullApiCommand ${pullApiCommand} \nLoading`);
    let outpullApiCommandResult = execSync(pullApiCommand).toString('utf8');
    console.log(`outpullApiCommandResult ${outpullApiCommandResult}`);

    const publishCommand = `apic publish ${product.name}_product_${product.version}.yaml --organization ${dst.organization} --server=${dst.server}   ${dst.space ? `--scope space --space ${dst.space}` : ''} --catalog ${dst.catalog} `;
    console.log(`pullApiCommand ${publishCommand} \nLoading`);
    let outPublishCommandResult = execSync(publishCommand).toString('utf8');
    console.log(`outPublishCommandResult ${outPublishCommandResult}`);

    process.exit(0);
  } catch (error) {
    const err = error.stdout ? error.stdout.toString('utf8') : error.message;
    publishing_err(err);

    process.exit(1);
  }
};

module.exports = promote;
