const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription("Şarkının döngü modunu açar/kapatırsınız.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Connect),
    async execute(interaction) {

        if (!interaction.client.player) {
            return interaction.reply('Şu anda çalan bir müzik yok!');
        }

        interaction.client.loop = !interaction.client.loop;
        const loopEmb = new EmbedBuilder()
        .setAuthor({ name: `Döngü modu ${interaction.client.loop ? 'aktif' : 'pasif'}.`, iconURL: interaction.client.user.displayAvatarURL()})
        .setDescription(`Döngü modu \`${interaction.client.loop ? 'aktif' : 'pasif'}\` hale getirildi.`)
        .setColor("Random")
        .setFooter({text: `${interaction.client.user.username}`})
        .setTimestamp()
        interaction.reply({embeds: [loopEmb]})
    }
}
