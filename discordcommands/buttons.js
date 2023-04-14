if(command === 'button'){

    const{ ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
    const button = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder
        .setCustomID('button')
        .setLabel('Click this Button')
        .setStyle(ButtonStyle.Primary),
        )
};

    const embed = new EmbedBuilder()
    .setColor("Blue")
    .setDescription(`${message.author.tag}'s button!`)
        
    const embed2 = new EmbedBuilder()
    .setColor("Blue")
    .setDescription('The button was pressed')

    message.reply[(embeds: [embed], components: [button])];
    


