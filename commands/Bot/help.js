const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Bot komutlarını listeler."),
    async execute(interaction) {

        const help = new EmbedBuilder()
        .setAuthor({ name: `🎉 ${interaction.client.user.username} burada!`, iconURL: interaction.client.user.displayAvatarURL()})
        .setColor("Random")
        .addFields(
            { name: "/play `<link>`", value: "Girdiğiniz linke ait şarkıyı açılır."},
            { name: "/stop", value: "Şarkı kapanır ve bot kanaldan ayrılır.", inline: true },
            { name: "/loop", value: "Döngü modunu açarsınız ve şarkı tekrarlanır veya tekrarlanmaz.", inline: true },
            { name: "/pause", value: "Şarkıyı duraklatırsınız.", inline: true },
            { name: "/resume", value: "Durdurulan şarkıyı devam ettirirsiniz.", inline: true },
            { name: "/volume", value: "Ses seviyesini ayarlarsınız.", inline: true }
        )
        .setDescription(`Bütün komutlarım aşağıda yer alıyor.\n**NOT:** __Proje tamamlanmadı geliştirilmeye devam ediyor. Son hali github'da paylaşılacaktır.__`)
        .setFooter({text: `${interaction.client.username} | Yardım Sayfası`, iconURL: interaction.client.user.displayAvatarURL()})
        .setTimestamp()

        const button1 = new ButtonBuilder()
        .setLabel('Botu Davet Et')
        .setURL('https://discord.com/oauth2/authorize?client_id=' + config.bot.client_id + '&scope=bot&permissions=277062437952')
        .setStyle(ButtonStyle.Link);

        const button2 = new ButtonBuilder()
        .setLabel('Destek Sunucusu')
        .setURL('https://discord.com/invite/')
        .setStyle(ButtonStyle.Link);

        const button3 = new ButtonBuilder()
        .setLabel('Github Repo')
        .setURL('https://github.com/justthendra/discord.js-v14-slash-müzik-bot')
        .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder()
        .addComponents(button1, button2, button3);
        return interaction.reply({ embeds: [help], components: [row] })
    }
}
