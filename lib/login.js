const { operation_finished, general_msg } = require('./messages');
const { execSync } = require('child_process');
const parseConfiguration = require('../util/parseConfiguration');

const login = (enviorment) => {
  const { env } = parseConfiguration();
  const configuration = env[enviorment];

  try {
    const { server, apiKey, username, password } = configuration;

    const pushCommand = `apic login --server=${server} ${apiKey ? `--apikey=${apiKey}` : `--username=${username} --password=${password}`}`;
    const pushCommandSenitized = `apic login --server=${server} ${apiKey ? `--apikey=` : `--username=${username} --password=`}`;

    console.log(`pushCommand ${pushCommandSenitized} \nLoading`);
    let outppushCommandResult = execSync(pushCommand).toString('utf8');
    console.log(`outppushCommandResult ${outppushCommandResult}`);

    operation_finished();
  } catch (error) {
    const err = error.stdout ? error.stdout.toString('utf8') : error.message;
    publishing_err(err);

    process.exit(1);
  }
};

module.exports = login;
