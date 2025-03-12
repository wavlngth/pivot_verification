const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

const { VERIFIED_ROLE_ID, VERIFICATION_CHANNEL_ID } = require('../config/config');

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}`);
    
    const channel = await client.channels.fetch(VERIFICATION_CHANNEL_ID);
    if (channel) {
        const embed = new EmbedBuilder()
            .setTitle('Welcome to the server!')
            .setDescription('Click the button below to verify your Roblox account.')
            .setColor('BLUE');
        
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setLabel('Verify')
                .setStyle(ButtonStyle.Link)
                .setURL(`${process.env.AUTH_URL}`)
        );
        
        await channel.send({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'getrole') {
        const member = interaction.member;
        const roles = member.roles.cache.map(role => role.name).join(', ');
        await interaction.reply(`Your roles: ${roles}`);
    }

    if (interaction.commandName === 'update') {
        const member = interaction.member;
        await member.roles.add(VERIFIED_ROLE_ID);
        await interaction.reply('Your roles have been updated.');
    }
});

module.exports = { start: () => client.login(process.env.DISCORD_BOT_TOKEN) };
