const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { VoiceConnectionStatus } = require('@discordjs/voice');
const { EmbedBuilder } = require('discord.js');
require('cute-logs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription("Botun ses kanalından ayrılmasını sağlar."),
    async execute(interaction) {
        await interaction.deferReply();

        const connection = interaction.client.connection;

        if (!connection || connection.state.status === VoiceConnectionStatus.Destroyed) {
            return interaction.editReply({ content: 'Ses kanalında değilim.', ephemeral: true });
        }

        try {
            connection.destroy();
            interaction.client.connection = null;

            const embed = new EmbedBuilder()
            .setDescription('📤 Ses kanalından ayrıldım!')
            .setColor("Random")
            .setFooter({ text: interaction.client.username, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setAuthor({ name: 'Ayrıldım!', iconURL: interaction.client.user.displayAvatarURL() });
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Ses kanalından ayrılırken bir hata oluştu:' + error, "Hata");
            interaction.editReply({ content: 'Ses kanalından ayrılırken bir hata oluştu.', ephemeral: true });
        }
    }
};