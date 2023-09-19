const { Client, GatewayIntentBits, MessageEmbed } = require('discord.js');
const config = require('../../config.json'); // You can store your bot's configuration in a separate file

module.exports = {
  name: 'reactionrole',
  description: 'Set up a reaction role.',
  usage: '.reactionrole @rolename :emoji:',
  execute(message, args) {
    // Check if the user has permission to set up reaction roles
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return message.channel.send('You do not have permission to set up reaction roles.');
    }

    // Check if the command has the correct number of arguments
    if (args.length !== 2) {
      return message.channel.send('Usage: !reactionrole @rolename :emoji:');
    }

    // Extract role name and emoji from the command arguments
    const roleName = args[0].replace(/<@&|>/g, ''); // Removes the mention syntax
    const emoji = args[1];

    // Find the role by name
    const role = message.guild.roles.cache.find((r) => r.name === roleName);

    // Check if the role exists
    if (!role) {
      return message.channel.send(`Role '${roleName}' not found.`);
    }

    // Send the reaction role message
    message.channel.send(`React with ${emoji} to get the '${roleName}' role.`)
      .then((reactionMessage) => {
        reactionMessage.react(emoji);

        // Listen for reactions and assign roles (similar to the previous example)
        const filter = (reaction, user) => {
          return reaction.emoji.name === emoji && !user.bot;
        };

        const collector = reactionMessage.createReactionCollector({ filter, time: 60000 });

        collector.on('collect', (reaction, user) => {
          const member = message.guild.members.cache.get(user.id);
          member.roles.add(role);
        });
      });

    // Example response
    const embed = new MessageEmbed()
      .setColor(config.color.default)
      .setTitle('Reaction Role Setup')
      .setDescription(`Reaction role set up for '${roleName}' role with ${emoji} emoji.`)
      .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
      .setTimestamp();

    message.channel.send(embed);
  },
};
