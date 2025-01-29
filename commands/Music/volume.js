const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription("Şarkının ses seviyesini ayarlarsınız.")
    .addIntegerOption(volume =>
        volume.setName("seviye")
        .setDescription("Ses seviyesi belirtin.")
        .setRequired(true)
    ),
    async execute(interaction) {

        const resource = interaction.client.resource;

        if (!resource) {
            const notplayingMusicEmb = new EmbedBuilder()
            .setAuthor({ name: "Şu anda çalan bir şarkı yok.", iconURL: interaction.client.user.displayAvatarURL()})
            .setDescription(`Şu anda çalan bir şarkı yok.`)
            .setColor("Random")
            .setFooter({text: `${interaction.client.user.username}`})
            .setTimestamp()
            interaction.reply({embeds: [notplayingMusicEmb]})
        }

        const level = interaction.options.getInteger("seviye")
        const volume = parseInt(level);

        if (isNaN(volume) || volume < 0 || volume > 100) {
            const setVolumeEmb = new EmbedBuilder()
            .setAuthor({ name: "Hatalı komut kullanıldı.", iconURL: interaction.client.user.displayAvatarURL()})
            .setDescription(`Lütfen 0 ile 100 arasında bir ses seviyesi belirtin.`)
            .setColor("Random")
            .setFooter({text: `${interaction.client.user.username}`})
            .setTimestamp()
            interaction.reply({embeds: [setVolumeEmb]})
        }

        resource.volume.setVolume(volume / 100);
        const setVolumeEmb = new EmbedBuilder()
        .setAuthor({ name: "Ses seviyesi ayarlandı.", iconURL: interaction.client.user.displayAvatarURL()})
        .setDescription(`Ses seviyesi \`${level}\` olarak ayarlandı.`)
        .setColor("Random")
        .setFooter({text: `${interaction.client.user.username}`})
        .setTimestamp()
        interaction.reply({embeds: [setVolumeEmb]})
    }
}
