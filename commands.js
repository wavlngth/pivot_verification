const { SlashCommandBuilder } = require('discord.js');

module.exports = [
    new SlashCommandBuilder()
        .setName('getrole')
        .setDescription('Get your current roles in the server.'),
    
    new SlashCommandBuilder()
        .setName('update')
        .setDescription('Update your roles based on verification.')
];
