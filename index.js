const {
    Client,
    GatewayIntentBits,
    Events
} = require('discord.js');
require('dotenv').config();
const media = require("./AniList API/media");
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
    console.log("bot is on");
    media.request("one piece", 'ANIME')
                .then(animeID => console.log(`The ID for One Piece is ${animeID}`))
                .catch(error => console.error(error));

})

client.on(Events.MessageCreate, message => {
    // console.log(message.content)
    // message.channel.send("hi");
    // console.log("hi");
    // console.log("bot is on");
    // media.request("one piece", 'ANIME')
    //             .then(animeID => console.log(`The ID for One Piece is ${animeID}`))
    //             .catch(error => console.error(error));
    if (message.author.bot) return;
    if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(' ');
        const command = args.shift().toLowerCase();
        if (command === 'anime') {
            const searchQuery = args.join(' ');
            media.request(searchQuery, 'ANIME')
                .then(animeID => message.reply(`The ID for One Piece is ${animeID}`))
                .catch(error => console.error(error));
            return;
        }
        return;
    }
})
client.login(process.env.TOKEN)











