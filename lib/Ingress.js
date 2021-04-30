const fs = require('fs');
const yaml = require('js-yaml');

const Ingress = async (env, name, domain) => {
  const Ingress = fs.readFileSync('./Ingress.yaml', 'utf8');
  const IngressObj = yaml.load(Ingress);
  IngressObj.metadata.name = name;
  IngressObj.metadata.namespace = env;

  IngressObj.spec.rules[0].host = `${name}-${env}.${domain}`;
  IngressObj.spec.rules[0].http.paths[0].backend.service.name = name;

  const yamlConf = yaml.dump(IngressObj, { forceQuotes: true, quotingType: '"' });
  fs.writeFileSync('Ingress.yaml', yamlConf, 'utf8');
};

module.exports = Ingress;
