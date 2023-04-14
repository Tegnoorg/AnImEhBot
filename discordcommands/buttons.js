const {
    ButtonBuilder
} = require('@discordjs/builders');
const {
    MessageActionRow,
    MessageButton
} = require('discord.js');

function createButton() {
    const button = new ButtonBuilder()
        .setCustomId('buttonId')
        .setLabel("hi")
        .setStyle('Primary'); // 'Primary', 'Secondary', 'Success', 'Danger', 'Link'

    return button;
}
module.exports = {
    createButton: createButton
};