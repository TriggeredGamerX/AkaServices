module.exports = async (client, member) => {
  // Replace 'YOUR_CHANNEL_ID' with the actual ID of the channel you want to send the message to
  const channelId = '1150804959592448081';

  // Find the channel by its ID
  const welcomeChannel = member.guild.channels.cache.get(channelId);

  // Check if the welcome channel exists and if the bot has permission to send messages
  if (welcomeChannel && welcomeChannel.permissionsFor(client.user).has('SEND_MESSAGES')) {
    try {
      // Get the member count of the server
      const memberCount = member.guild.memberCount;

      // Create a welcome message with emojis and user's avatar on the right side
      const welcomeMessage = `:tada: **Welcome to the server, ${member.user.tag}!** :wave:\nWe now have ${memberCount} members. Enjoy your stay! :smile:`;

      // Send the welcome message to the specified channel
      await welcomeChannel.send({
        content: welcomeMessage,
        files: [member.user.displayAvatarURL({ format: "png", dynamic: true, size: 256 })]
      });
    } catch (error) {
      console.error('Error sending welcome message:', error);
    }
  } else {
    console.log('Welcome channel not found or bot lacks permissions to send messages.');
  }
};
