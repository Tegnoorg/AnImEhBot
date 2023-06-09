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
const fs = require('fs');
const media = require("./AniList API/media");
const airing = require("./AniList API/episodeAir");
const button = require("./discordcommands/buttons");
const recommendations = require("./AniList API/suggestions");
const prefix = "!";

let info = null;
let user = null;
let userId = null;
let ids = null;
let idRec = 21;
let buttonMessage = {};

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
});

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
          if (ids[userId] != null) {
              ids[userId]++;
          } else {
              ids[userId] = 1;
          }
          fs.writeFileSync('usage.json', JSON.stringify(ids));
          media.request(searchQuery, 'ANIME')
              .then(animeID =>  airing.request(animeID))
              .then(animeInfo => {
                idRec = animeInfo.id;
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
  }
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId == "synopsis") {
      interaction.channel.send(`${user} Synopsis: ${info.synopsis}`);
      interaction.update(buttonMessage);
  } else if (interaction.customId == "recommendations") {
      try {
          try {
            console.log(idRec);
              const recommendationsList = await recommendations.request(idRec);
              console.log(recommendationsList);
              const recID = recommendationsList[Math.floor(Math.random() * recommendationsList.length)];
              const recAnimeInfo = await airing.request(recID);
              console.log('recId: ' + recID);
              if (recAnimeInfo.isAiring) {
                  const buttonMessage1 = {
                      content: `${user} The next episode of ${recAnimeInfo.title} is releasing in ${recAnimeInfo.nextEpisodeReleaseDate}. ${recAnimeInfo.animeUrl}`,
                  };
                  interaction.channel.send(buttonMessage1);
                  interaction.update(buttonMessage1);
              } else {
                  const buttonMessage1 = {
                      content: `${user} ${recAnimeInfo.title} has finished airing. The last episode was episode ${recAnimeInfo.lastEpisodeNumber}. ${recAnimeInfo.animeUrl}`,
                  };
                  interaction.channel.send(buttonMessage1);
                  interaction.update(buttonMessage);
              }

          } catch (error) {
              console.error(error);
          }
      } catch (error) {
          console.error('Error getting anime recommendations: ', error);
      }


  }
});


client.login(process.env.TOKEN);

// Tegnoor didn't do much hes a bot, Vish solo'd ez work