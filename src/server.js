const express = require('express');
const axios = require('axios');
const session = require('express-session');
const { assignRole } = require('./roles');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: true }));

const { ROBLOX_CLIENT_ID, ROBLOX_CLIENT_SECRET, REDIRECT_URI } = require('../config/config');

app.get('/auth/roblox', (req, res) => {
    const authUrl = `https://apis.roblox.com/oauth/v1/authorize?client_id=${ROBLOX_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid`;
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send('No code provided.');

    try {
        const tokenRes = await axios.post('https://apis.roblox.com/oauth/v1/token', {
            client_id: ROBLOX_CLIENT_ID,
            client_secret: ROBLOX_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI
        }, { headers: { 'Content-Type': 'application/json' } });

        const accessToken = tokenRes.data.access_token;
        const userInfo = await axios.get('https://apis.roblox.com/oauth/v1/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        
        const robloxUserId = userInfo.data.sub;
        const robloxUsername = userInfo.data.name;

        const success = await assignRole(robloxUserId, req.session.discordUserId);
        res.send(success ? `Verified as ${robloxUsername} (${robloxUserId})!` : 'Verification failed.');
    } catch (error) {
        console.error(error);
        res.send('Error during verification.');
    }
});

module.exports = { start: () => app.listen(port, () => console.log(`Server running on port ${port}`)) };
