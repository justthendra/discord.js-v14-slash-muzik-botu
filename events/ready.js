const { ActivityType, Events } = require('discord.js');
const config = require('../config.json')
require('cute-logs')

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {

        client.user.setStatus(config.bot.presence.status);
        client.user.setPresence({
            activities: [{
                name: config.bot.presence.text,
                type: ActivityType.Listening
            }]
        })

        console.success(client.user.username + " müzik açmaya hazır!", "Bot");
    }
}