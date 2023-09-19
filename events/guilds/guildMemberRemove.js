const { MessageEmbed } = require('discord.js');

module.exports = (client, member) => {
  // Replace 'YOUR_CHANNEL_ID' with the actual ID of the channel you want to send the message to
  const channelId = '1151225670123401319';

  // Find the channel by its ID
  const goodbyeChannel = member.guild.channels.cache.get(channelId);

  if (goodbyeChannel) {
    // Create a goodbye message with user's tag and emojis
    const goodbyeMessage = `:wave: **Goodbye, ${member.user.tag}! We'll miss you.** :cry:`;

    // Send the goodbye message to the specified channel
    goodbyeChannel.send({
      content: goodbyeMessage,
      files: [member.user.displayAvatarURL({ format: "png", dynamic: true, size: 256 })]
    });
  }
};
