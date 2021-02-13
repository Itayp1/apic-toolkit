const fs = require("fs");
const yaml = require("js-yaml");

function scripts2Yaml() {
  try {
    let fileContents = fs.readFileSync("./example.yaml", "utf8");
    let data = yaml.load(fileContents);
    const execute = data["x-ibm-configuration"].assembly.execute;
    data["x-ibm-configuration"].assembly.execute = checkForScripts(execute);
    const updatedYaml = yaml.dump(data, {});
    fs.writeFileSync("updatedYaml.yaml", updatedYaml);
  } catch (e) {
    console.log(e);
  }
}

function checkForScripts(data) {
  return data.map((obj) => {
    const [operation] = Object.keys(obj);
    const extracetObj = obj[operation];
    switch (operation) {
      case "gatewayscript":
        const { title: jsName } = extracetObj;
        try {
          obj.gatewayscript.source = fs.readFileSync(`./${jsName}.js`, "utf8");
        } catch (error) {}
        return obj;
      case "if":
        if (extracetObj.execute.length > 0) {
          obj.if.execute = checkForScripts(extracetObj.execute);
          return obj;
        }
        return obj;
      case "operation-switch":
        if (extracetObj.case.length > 0) {
          obj["operation-switch"].case = checkForScripts(extracetObj.case);
        }
        return obj;
      case "switch":
        if (extracetObj.case.length > 0) {
          obj.switch.case = checkForScripts(extracetObj.case);
        }
        return obj;
      case "operations":
        if (obj.execute.length > 0) {
          obj.operations.execute = checkForScripts(obj.execute);
        }
        return obj;
      case "xslt":
        const { title } = extracetObj;

        try {
          obj.xslt.source = fs.readFileSync(`./${title}.xsl`, "utf8");
        } catch (error) {}
        return obj;
      default:
        return obj;
    }
  });
}

module.exports = scripts2Yaml;
