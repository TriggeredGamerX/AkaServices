// events/message.js

module.exports = (client, message) => {
  if (message.author.bot) return;

  // Check if the message content is 'ping'
  if (message.content === 'ping') {
    // Calculate the latency
    const latency = Date.now() - message.createdTimestamp;

    // Reply with the latency in milliseconds
    message.reply(`Pong! Bot Running at ${latency}ms.`);
  }

  // You can add more message handling logic here
};
