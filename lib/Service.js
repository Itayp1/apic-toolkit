const fs = require('fs');
const yaml = require('js-yaml');

const Service = async (env, name) => {
  const Service = fs.readFileSync('./Service.yaml', 'utf8');
  const ServiceObj = yaml.load(Service);
  ServiceObj.metadata = { name, namespace: env };
  ServiceObj.spec.selector.app = name;
  const yamlConf = yaml.dump(ServiceObj, { forceQuotes: true, quotingType: '"' });
  fs.writeFileSync('Service.yaml', yamlConf, 'utf8');
};

module.exports = Service;
