const fs = require('fs');
const yaml = require('js-yaml');
const { notFoundConf_msg, bad_format_msg, operation_finished, publishing_err } = require('../lib/messages');

const parseConfiguration = () => {
  try {
    const configurationYaml = fs.readFileSync('./configuration.yaml', 'utf8');
    try {
      const { configuration } = yaml.load(configurationYaml);
      if (!configuration) {
        bad_format_msg('configuration root element is missing from configuration.yaml');
        process.exit(0);
      }
      return configuration;
    } catch (error) {
      const err = error.stdout ? error.stdout.toString('utf8') : error.message;
      publishing_err(err);

      process.exit(0);
    }
  } catch (error) {
    notFoundConf_msg();
    process.exit(0);
  }
};

module.exports = parseConfiguration;
