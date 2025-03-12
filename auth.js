const axios = require('axios');
require('dotenv').config();

const { ROBLOX_CLIENT_ID, ROBLOX_CLIENT_SECRET, REDIRECT_URI } = require('../config/config');

const getAccessToken = async (code) => {
    try {
        const response = await axios.post('https://apis.roblox.com/oauth/v1/token', {
            client_id: ROBLOX_CLIENT_ID,
            client_secret: ROBLOX_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI
        }, { headers: { 'Content-Type': 'application/json' } });

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
};

const getUserInfo = async (accessToken) => {
    try {
        const response = await axios.get('https://apis.roblox.com/oauth/v1/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null;
    }
};

module.exports = { getAccessToken, getUserInfo };
