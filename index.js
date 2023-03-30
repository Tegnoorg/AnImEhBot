const { Client, Events, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const media = require('./AniList API/media');
const prefix = '!';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let animeID; 

client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}`);
        const channel = client.channels.cache.get('1084221301046136926');
        
        if (channel && channel.viewable) {
          console.log(`The bot can see the ${channel.name} channel`);
        } else {
          console.log(`The bot can't see the specified channel`);
        }
      
      })

client.on('message', (message) => {

  console.log('Works');
  message.reply('Hello')
      .then(() => console.log('Replied to message "${message.content}"'))
      .catch(console.error);

    message.TextChannel.send("hi")
  if (message.author.bot) return;
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'anime') {
      const searchQuery = args.join(' ');
      media
        .request(searchQuery, 'ANIME')
        .then((id) => message.channel.send(`The ID for ${searchQuery} is ${id}`))
        .catch((error) => console.error(error));
    }
    return;
  }
  message.channel.send(`The ID for One Piece is ${animeID}`);
});

client.login(process.env.TOKEN);
