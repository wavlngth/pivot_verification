const { Client } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const { DISCORD_GUILD_ID, VERIFIED_ROLE_ID, REQUIRED_GROUP_ID, REQUIRED_GROUP_RANK } = require('../config/config');

const client = new Client();

const assignRole = async (robloxUserId, discordUserId) => {
    try {
        const groupRes = await axios.get(`https://groups.roblox.com/v1/users/${robloxUserId}/groups/roles`);
        const groupData = groupRes.data.data.find(group => group.group.id == REQUIRED_GROUP_ID);
        if (!groupData || groupData.role.rank < REQUIRED_GROUP_RANK) return false;
        
        const guild = await client.guilds.fetch(DISCORD_GUILD_ID);
        const member = await guild.members.fetch(discordUserId);
        if (!member) return false;
        
        await member.roles.add(VERIFIED_ROLE_ID);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

module.exports = { assignRole };
