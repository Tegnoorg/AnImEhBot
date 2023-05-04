const {
  Client,
  GatewayIntentBits,
  Events,
  MessageActionRow,
  MessageButton,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require('discord.js');
require('dotenv').config();
const fs = require('fs')
const media = require("./AniList API/media");
const airing = require("./AniList API/episodeAir");
const button = require("./discordcommands/buttons")
const prefix = "!";

let info = null;
let user = null;
let userId = null;
let ids = null;

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
          userId = message.author.id;
          
            user = message.author;
            
            ids = JSON.parse(fs.readFileSync('usage.json'));
            if(ids[userId] != null){
                ids[userId]++;
            }else{
                ids[userId]= 1;
            }
            fs.writeFileSync('usage.json', JSON.stringify(ids));
          media.request(searchQuery, 'ANIME')
              .then(animeID => airing.request(animeID))
              .then(animeInfo => {
                  if (animeInfo.isAiring) {
                      const row = new ActionRowBuilder()
                          .addComponents(button.createButton());
                      const buttonMessage = {
                          content: `${user} The next episode of ${animeInfo.title} is releasing in ${animeInfo.nextEpisodeReleaseDate}. ${animeInfo.animeUrl}`,
                          components: [row],
                      };
                      message.channel.send(buttonMessage);
                  } else {
                      const row = new ActionRowBuilder()
                          .addComponents(button.createButton());
                      const buttonMessage = {
                          content: `${user} ${animeInfo.title} has finished airing. The last episode was episode ${animeInfo.lastEpisodeNumber}. ${animeInfo.animeUrl}`,
                          components: [row],
                      };
                      message.channel.send(buttonMessage);
                  }
                  info = animeInfo;
              })
              .catch(error => console.error(error));
              
          return;
      }
      return;
  }
});

client.on('interactionCreate', interaction => {
    if (!interaction.isButton()) return;
    if(interaction.customId == "synopsis"){
        interaction.channel.send(`${user} Synopsis: ${info.synopsis}`);
      }else if(interaction.customId == "recommendations"){

      }
  });

client.login(process.env.TOKEN)