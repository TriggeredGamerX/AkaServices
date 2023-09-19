module.exports = async (client, oldState, newState) => {
  // Replace 'YOUR_CHANNEL_ID' with the actual ID of the channel where you want to send the message
  const channelId = '1151225431329087559';

  // Find the channel by its ID
  const targetChannel = client.channels.cache.get(channelId);

  if (targetChannel) {
    try {
      // Send a message to the specified channel when a user joins a voice channel
      if (!oldState.channelID && newState.channelID) {
        // User joined a voice channel
        const member = newState.member;
        await targetChannel.send(`${member.user.tag} has joined a voice channel.`);
      }

      // Send a message to the specified channel when a user leaves a voice channel
      if (oldState.channelID && !newState.channelID) {
        // User left a voice channel
        const member = oldState.member;
        await targetChannel.send(`${member.user.tag} has left a voice channel.`);
      }

      // You can add more conditions and messages as needed for other voice state changes

    } catch (error) {
      console.error('Error sending message to the channel:', error);
    }
  } else {
    console.log('Target channel not found.');
  }
};
