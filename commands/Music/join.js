const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
require('cute-logs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription("Botu ses kanalınıza ekler."),
    async execute(interaction) {
        await interaction.deferReply();

        const voiceChannel = interaction.member.voice.channel;

        if (!voiceChannel) {
            return interaction.editReply({ content: 'Ses kanalında değilsiniz. Lütfen ses kanalına bağlanın.'});
        }

        try {
            const connection = joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator,
            });

            connection.on(VoiceConnectionStatus.Ready, () => {
                console.info('Ses kanalına bağlandım!', "Müzik");
            });

            connection.on(VoiceConnectionStatus.Disconnected, () => {
                connection.destroy();
                console.info('Ses kanalından ayrıldım!', "Müzik");
            });

            interaction.client.connection = connection;
            const embed = new EmbedBuilder()
            .setDescription('📥 Ses kanalına katıldım!')
            .setColor("Random")
            .setFooter({ text: interaction.client.username, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp()
            .setAuthor({ name: 'Katıldım!', iconURL: interaction.client.user.displayAvatarURL() });
            interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Ses kanalına bağlanırken bir hata oluştu:' + error, "Hata");
            return interaction.editReply({ content: 'Ses kanalına bağlanırken bir hata oluştu.'});
        }
    }
};