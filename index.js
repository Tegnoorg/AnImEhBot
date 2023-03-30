const {
    Client,
    GatewayIntentBits,
    Events
} = require('discord.js');
require('dotenv').config();
const media = require("./AniList API/media");
const airing = require("./AniList API/episodeAir");
const prefix = "!";


const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

client.on('ready', () => {
    console.log(`${client.user.username} has logged in.`);
})

client.on(Events.MessageCreate, message => {
  if (message.author.bot) return;
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'anime') {
      const searchQuery = args.join(' ');
      media.request(searchQuery, 'ANIME')
        .then(animeID => airing.request(animeID))
        .then(animeInfo => {
          if (animeInfo.isAiring) {
            message.reply(`The next episode of ${animeInfo.title} is releasing in ${animeInfo.nextEpisodeReleaseDate}. ${animeInfo.animeUrl}`);
          } else {
            message.reply(`${animeInfo.title} has finished airing. The last episode was episode ${animeInfo.lastEpisodeNumber}. ${animeInfo.animeUrl}`);
          }
        })
        .catch(error => console.error(error));
      return;
    }
    return;
  }
})
  
client.login(process.env.TOKEN)











