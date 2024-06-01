const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Durdurulan şarkıyı devam ettirirsiniz.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect),
    async execute(interaction) {

        const player = interaction.client.player;

        if (player) {
            if (player.unpause()) {

                const resumeEmb = new EmbedBuilder()
                .setAuthor({ name: "Şarkı devam ediyor.", iconURL: interaction.client.user.displayAvatarURL()})
                .setDescription(`Şarkı kaldığı yerden devam ediyor.`)
                .setColor("Random")
                .setFooter({text: `${interaction.client.user.username}`})
                .setTimestamp()
                interaction.reply({embeds: [resumeEmb]})
            } else {
                const aldreadyMusicResume = new EmbedBuilder()
                .setAuthor({ name: "Şarkı zaten devam ediyor.", iconURL: interaction.client.user.displayAvatarURL()})
                .setDescription(`Şarkı zaten devam ediyor.`)
                .setColor("Random")
                .setFooter({text: `${interaction.client.user.username}`})
                .setTimestamp()
                interaction.reply({embeds: [aldreadyMusicResume]})
            }
        } else {
                const notplayingMusicEmb = new EmbedBuilder()
                .setAuthor({ name: "Duraklatılmış bir şarkı yok.", iconURL: interaction.client.user.displayAvatarURL()})
                .setDescription(`Duraklatılmış bir şarkı göremedim.`)
                .setColor("Random")
                .setFooter({text: `${interaction.client.user.username}`})
                .setTimestamp()
                interaction.reply({embeds: [notplayingMusicEmb]})
        }

    }
}
