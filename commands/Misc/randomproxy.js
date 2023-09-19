const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const config = require('../../config.json');

module.exports = {
  name: 'proxy',
  description: 'Get a random proxy from the proxylist.',
  filters: ['USER'], // You can adjust the filters as needed
  async execute(message) {
    // Function to read the proxy list from proxylist.txt file
    function readProxyList() {
      try {
        const proxyList = fs.readFileSync('proxylist.txt', 'utf8').split('\n');
        // Remove any empty lines
        const cleanedList = proxyList.filter(proxy => proxy.trim() !== '');
        return cleanedList;
      } catch (error) {
        console.error('Error reading proxylist.txt:', error);
        return [];
      }
    }

    // Function to get a random proxy from the list
    function getRandomProxy() {
      const proxyList = readProxyList();
      if (proxyList.length === 0) {
        return 'Proxy list is empty or could not be read.';
      }

      const randomIndex = Math.floor(Math.random() * proxyList.length);
      return proxyList[randomIndex];
    }

    const randomProxy = getRandomProxy();

    const proxyEmbed = new MessageEmbed()
      .setColor(config.color.default)
      .setTitle('Random Proxy')
      .setDescription(randomProxy)
      .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 64 }))
      .setTimestamp();

    message.channel.send(proxyEmbed);
  },
};
