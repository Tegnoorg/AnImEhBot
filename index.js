const {
    Client,
    GatewayIntentBits
} = require('discord.js');
require('dotenv').config();
const media = require("./AniList API/media");
const prefix = "!";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
})

client.on('ready', () => {
    console.log("bot is on");
    // media.request("one piece", 'ANIME')
    //             .then(animeID => console.log(`The ID for One Piece is ${animeID}`))
    //             .catch(error => console.error(error));

})

client.on('message', (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(' ');
        const command = args.shift().toLowerCase();
        if (command === 'anime') {
            const searchQuery = args.join(' ');
            media.request(searchQuery, 'ANIME')
                .then(animeID => console.log(`The ID for One Piece is ${animeID}`))
                .catch(error => console.error(error));
            return;
        }
        return;
    }
})
client.login(process.env.TOKEN)