const { operation_finished, publishing_err } = require('./messages');
const { execSync } = require('child_process');
const parseConfiguration = require('../util/parseConfiguration');

const login = (enviorment) => {
  const { env } = parseConfiguration();
  const configuration = env[enviorment];

  try {
    const { server, apiKey } = configuration;

    const pushCommand = `apic login --server=${server} --apikey=${apiKey}`;
    console.log(`pushCommand ${pushCommand} \nLoading`);
    let outppushCommandResult = execSync(pushCommand).toString('utf8');
    console.log(`outppushCommandResult ${outppushCommandResult}`);

    operation_finished();
  } catch (error) {
    const err = error.stdout ? error.stdout.toString('utf8') : error.message;
    publishing_err(err);

    process.exit(0);
  }
};

module.exports = login;
