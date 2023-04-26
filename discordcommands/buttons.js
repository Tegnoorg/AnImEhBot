const {
    ButtonBuilder
} = require('@discordjs/builders');
const {
    MessageActionRow,
    MessageButton
} = require('discord.js');

function createButton() {
    const synopsis = new ButtonBuilder()
        .setCustomId('synopsis')
        .setLabel("synopsis")
        .setStyle('Primary'); // 'Primary', 'Secondary', 'Success', 'Danger', 'Link'
    
    const recommendations = new ButtonBuilder()
        .setCustomId('recommendations')
        .setLabel("recommendations")
        .setStyle('Primary'); // 'Primary', 'Secondary', 'Success', 'Danger', 'Link'

    return [synopsis, recommendations];
}
module.exports = {
    createButton: createButton
};