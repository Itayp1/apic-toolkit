// const { prompt } = require("enquirer");
const fs = require("fs");
const { Select } = require("enquirer");

const chooseOperation = new Select({
  name: "operation",
  message: "Choose a operation",
  choices: ["yaml2scripts", "scripts2yaml"],
});

const chooseYamlFile = (files) =>
  new Select({
    name: "yamlFile",
    message: "Choose a yamlFile",
    choices: files,
  });

const start = async () => {
  const response = await chooseOperation.run();
  const files = fs.readdirSync("./").filter((name) => name.includes(".yaml"));
  console.log(response);

  const response2 = await chooseYamlFile(files).run();
  console.log(response2);
};

start();
