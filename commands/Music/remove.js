const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Çalma sırasındaki belirli bir şarkıyı kaldırır.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
        .addIntegerOption(option => 
            option.setName('sıra')
                .setDescription('Kaldırmak istediğiniz şarkının sıra numarası.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const index = interaction.options.getInteger('sıra') - 1; // Kullanıcı sıfırdan başlamak yerine 1'den başlar
        const queue = interaction.client.queue;

        if (!queue || queue.length === 0) {
            return interaction.editReply({ content: 'Çalma sırası boş.', ephemeral: true });
        }

        if (index < 0 || index >= queue.length) {
            return interaction.editReply({ content: 'Geçersiz sıra numarası.', ephemeral: true });
        }

        const removedSong = queue.splice(index, 1)[0];

        interaction.editReply({ content: `\`${removedSong.title}\` şarkısı çalma sırasından kaldırıldı.` });
    }
};