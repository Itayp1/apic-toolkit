const fs = require('fs');
const yaml = require('js-yaml');
const Ajv = require('ajv').default;
var ajv = new Ajv({ allErrors: true, strict: false });
const configurationSchema = require('./configurationSchema.json');
const envSchema = require('./envSchema.json');
const { notFoundConf_msg, bad_format_msg } = require('../lib/messages');

const parseConfiguration = () => {
  try {
    const configurationYaml = fs.readFileSync('./configuration.yaml', 'utf8');
    try {
      const configurationFile = yaml.load(configurationYaml);
      if (!configurationFile.configuration) {
        bad_format_msg('configuration root element is missing from configuration.yaml');
        process.exit(1);
      }
      validate(configurationSchema, configurationFile);
      const {
        configuration: { env },
      } = configurationFile;
      const enviroments = [];
      Object.entries(env).forEach((obj) => {
        const [objKey, valueObj] = obj;
        enviroments.push(valueObj);
      });
      validate(envSchema, enviroments);
      return configurationFile.configuration;
    } catch (error) {
      const err = error.stdout ? error.stdout.toString('utf8') : error.message;
      bad_format_msg(err);
      process.exit(0);
    }
  } catch (error) {
    notFoundConf_msg(error.message);
    process.exit(0);
  }
};

function validate(schema, payload) {
  try {
    const validate = ajv.compile(schema);
    const valid = validate(payload);
    if (!valid) {
      bad_format_msg(JSON.stringify(validate.errors));
      process.exit(0);
    }
  } catch (error) {
    bad_format_msg(JSON.stringify(error.message));
    process.exit(0);
  }
}

module.exports = parseConfiguration;
