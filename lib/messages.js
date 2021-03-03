const chalk = require('chalk');

const { BADFORMAT, GOODBYE, NOTFOUND, OPERATION_NOTFOUND } = require('./messages.json');

module.exports = {
  bad_format_msg: (msg) => console.log(chalk.redBright(BADFORMAT) + '\n' + chalk.redBright(msg)),
  goodbye_msg: () => console.log(chalk.blue(GOODBYE)),
  notFound_msg: () => console.log(chalk.redBright(NOTFOUND)),
  operationNotFound_msg: () => console.log(chalk.redBright(OPERATION_NOTFOUND)),
};

/*
black
red
green
yellow
blue
magenta
cyan
white
blackBright (alias: gray, grey)
redBright
greenBright
yellowBright
blueBright
magentaBright
cyanBright
whiteBright
*/
