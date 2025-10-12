const { ActivityType, Events } = require('discord.js');
const config = require('../config.json')

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

        console.log(client.user.username + " müzik açmaya hazır!");
    }

}
