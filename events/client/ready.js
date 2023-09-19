// events/ready.js
const CatLoggr = require('cat-loggr');
const log = new CatLoggr();
const config = require('../../config.json');
module.exports = (client) => {
  log.info(`I am logged in as ${client.user.tag} to Discord!`);
    console.log(`Using discord.js version ${require('discord.js').version}`);
  client.user.setActivity(`${config.prefix}help • ${config.status}`, { type: "LISTENING" });
};
