const chalk = require('chalk');

const { BADFORMAT, GOODBYE, NOTFOUND, OPERATION_NOTFOUND, NOTFOUND_CONF, FINISHED, APIC_WAIT } = require('./messages.json');

module.exports = {
  bad_format_msg: (msg) => console.log(chalk.redBright(BADFORMAT) + '\n' + chalk.redBright(msg)),
  goodbye_msg: () => console.log(chalk.blue(GOODBYE)),
  notFound_msg: () => console.log(chalk.redBright(NOTFOUND)),
  notFoundConf_msg: () => console.log(chalk.redBright(NOTFOUND_CONF)),
  operationNotFound_msg: () => console.log(chalk.redBright(OPERATION_NOTFOUND)),
  operation_finished: () => console.log(chalk.blue(FINISHED)),
  please_wait_publishing: () => console.log(chalk.blue(APIC_WAIT)),
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
