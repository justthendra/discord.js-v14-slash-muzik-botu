const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { VoiceConnectionStatus } = require('@discordjs/voice');
require('cute-logs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription("Botun ses kanalından ayrılmasını sağlar.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Connect),
    async execute(interaction) {
        await interaction.deferReply();

        const connection = interaction.client.connection;

        if (!connection || connection.state.status === VoiceConnectionStatus.Destroyed) {
            return interaction.editReply({ content: 'Ses kanalında değilim.', ephemeral: true });
        }

        try {
            connection.destroy();
            interaction.client.connection = null;
            interaction.editReply('Ses kanalından ayrıldım!');
        } catch (error) {
            console.error('Ses kanalından ayrılırken bir hata oluştu:' + error, "Hata");
            interaction.editReply({ content: 'Ses kanalından ayrılırken bir hata oluştu.', ephemeral: true });
        }
    }
};