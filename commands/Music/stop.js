const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription("Şarkı kapatırsınız ve bot kanaldan ayrılır.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect),
    async execute(interaction) {

        const player = interaction.client.player;
        const connection = interaction.client.connection;

        if (player) {
            player.stop();
            connection.destroy();

            const stopEmb = new EmbedBuilder()
            .setAuthor({ name: "Şarkı kapatıldı.", iconURL: interaction.client.user.displayAvatarURL()})
            .setDescription(`Şarkı kapatıldığı için kanaldan ayrılıyorum.`)
            .setColor("Random")
            .setFooter({text: `${interaction.client.user.username}`})
            .setTimestamp()
            interaction.reply({embeds: [stopEmb]})
        } else {
            const noQueEmb = new EmbedBuilder()
            .setAuthor({ name: "Şu anda çalan bir şarkı yok.", iconURL: interaction.client.user.displayAvatarURL()})
            .setDescription(`Şu anda bir şarkı çalmıyor zaten.`)
            .setColor("Random")
            .setFooter({text: `${interaction.client.user.username}`})
            .setTimestamp()
            interaction.reply({embeds: [noQueEmb]})
        }
    }
}
