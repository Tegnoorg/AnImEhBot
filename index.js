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
const media = require("./AniList API/media");
const airing = require("./AniList API/episodeAir");
const button = require("./discordcommands/buttons")
const prefix = "!";

let info = null;

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
                      const row = new ActionRowBuilder()
                          .addComponents(button.createButton());
                      const buttonMessage = {
                          content: `The next episode of ${animeInfo.title} is releasing in ${animeInfo.nextEpisodeReleaseDate}. ${animeInfo.animeUrl}`,
                          components: [row],
                      };
                      message.reply(buttonMessage);
                  } else {
                      const row = new ActionRowBuilder()
                          .addComponents(button.createButton());
                      const buttonMessage = {
                          content: `${animeInfo.title} has finished airing. The last episode was episode ${animeInfo.lastEpisodeNumber}. ${animeInfo.animeUrl}`,
                          components: [row],
                      };
                      message.reply(buttonMessage);
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
        interaction.reply(`Synopsis: ${info.synopsis}`);
      }else if(interaction.customId == "recommendations"){

      }
  });
client.login(process.env.TOKEN)