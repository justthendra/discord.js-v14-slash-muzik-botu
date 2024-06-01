const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Şarkıyı duraklatırsınız.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect),
    async execute(interaction) {

        const player = interaction.client.player;

        if (player) {
            if (player.pause()) {

                const pauseEmb = new EmbedBuilder()
                .setAuthor({ name: "Şarkı duraklatıldı.", iconURL: interaction.client.user.displayAvatarURL()})
                .setDescription(`Şarkı başarıyla duraklatıldı.`)
                .setColor("Random")
                .setFooter({text: `${interaction.client.user.username}`})
                .setTimestamp()
                interaction.reply({embeds: [pauseEmb]})
            } else {

                const alreadyPauseEmb = new EmbedBuilder()
                .setAuthor({ name: "Şarkı zaten duraklatılmış.", iconURL: interaction.client.user.displayAvatarURL()})
                .setDescription(`Şarkı zaten duraklatılmış.`)
                .setColor("Random")
                .setFooter({text: `${interaction.client.user.username}`})
                .setTimestamp()
                interaction.reply({embeds: [alreadyPauseEmb]})
            }
        } else {

                const notplayingMusicEmb = new EmbedBuilder()
                .setAuthor({ name: "Şu anda çalan bir şarkı yok.", iconURL: interaction.client.user.displayAvatarURL()})
                .setDescription(`Şu anda çalan bir şarkı yok.`)
                .setColor("Random")
                .setFooter({text: `${interaction.client.user.username}`})
                .setTimestamp()
                interaction.reply({embeds: [notplayingMusicEmb]})
        }

    }
}
