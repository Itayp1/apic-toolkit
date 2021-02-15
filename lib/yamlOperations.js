const fs = require('fs');
const yaml = require('js-yaml');

function YamlOperation(operations) {
  this.gatewayscript = operations.gatewayscript;
  this.xslt = operations.xslt;
}

YamlOperation.prototype.checkForScripts = function (data) {
  return data.map((obj) => {
    const [operation] = Object.keys(obj);
    const extracetObj = obj[operation];
    switch (operation) {
      case 'gatewayscript':
        const { title: jsName } = extracetObj;
        try {
          this.gatewayscript(obj, jsName);
        } catch (error) {}
        return obj;
      case 'if':
        if (extracetObj.execute.length > 0) {
          obj.if.execute = this.checkForScripts(extracetObj.execute);
          return obj;
        }
        return obj;
      case 'condition':
        if (obj.execute.length > 0) {
          obj.execute = this.checkForScripts(obj.execute);
          return obj;
        }
        return obj;
      case 'otherwise':
        if (obj.otherwise.length > 0) {
          obj.otherwise = this.checkForScripts(obj.otherwise);
        }
        return obj;
      case 'operation-switch':
        if (extracetObj.case.length > 0) {
          obj['operation-switch'].case = this.checkForScripts(extracetObj.case);
        }
        return obj;
      case 'switch':
        if (extracetObj.case.length > 0) {
          obj.switch.case = this.checkForScripts(extracetObj.case);
        }
        return obj;
      case 'operations':
        if (obj.execute.length > 0) {
          obj.operations.execute = this.checkForScripts(obj.execute);
        }
        return obj;
      case 'xslt':
        const { title: xslName } = extracetObj;

        try {
          this.xslt(obj, xslName);
        } catch (error) {}
        return obj;
      default:
        return obj;
    }
  });
};

function scripts2Yaml(fileName) {
  const operations = {
    gatewayscript: (obj, jsName) => (obj.gatewayscript.source = fs.readFileSync(`./${jsName}.js`, 'utf8')),
    xslt: (obj, xslName) => (obj.xslt.source = fs.readFileSync(`./${xslName}.xsl`, 'utf8')),
  };
  try {
    let fileContents = fs.readFileSync(`./${fileName}`, 'utf8');
    let data = yaml.load(fileContents);
    const execute = data['x-ibm-configuration'].assembly.execute;
    const scripts2YamlOperation = new YamlOperation(operations);
    data['x-ibm-configuration'].assembly.execute = scripts2YamlOperation.checkForScripts(execute);
    const updatedYaml = yaml.dump(data, {});
    fs.writeFileSync(fileName, updatedYaml);
  } catch (e) {
    console.log(e);
  }
}

function yaml2Scripts(fileName) {
  const operations = {
    gatewayscript: (obj, jsName) => fs.writeFileSync(`./${jsName}.js`, obj.gatewayscript.source, 'utf8'),
    xslt: (obj, xslName) => fs.writeFileSync(`./${xslName}.xsl`, obj.xslt.source, 'utf8'),
  };
  try {
    let fileContents = fs.readFileSync(`./${fileName}`, 'utf8');
    let data = yaml.load(fileContents);
    const execute = data['x-ibm-configuration'].assembly.execute;

    const scripts2YamlOperation = new YamlOperation(operations);
    scripts2YamlOperation.checkForScripts(execute);
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  scripts2Yaml,
  yaml2Scripts,
};
