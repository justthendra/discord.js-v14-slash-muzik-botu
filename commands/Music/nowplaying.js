const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription("Şu anda çalan şarkının bilgilerini gösterir."),
    async execute(interaction) {
        await interaction.deferReply();

        const player = interaction.client.player;
        const currentSong = interaction.client.currentSong;

        if (!player || !currentSong) {
            return interaction.editReply('Şu anda çalan bir şarkı yok.');
        }

        const song = {
            title: currentSong.title,
            url: currentSong.url,
            duration:currentSong.duration,
            thumbnail: currentSong.thumbnail,
            author: currentSong.author,
            views: currentSong.views,
            date: currentSong.date
        };

        const nowPlayingEmb = new EmbedBuilder()
            .setTitle(`${song.title} | ${song.author}`)
            .setDescription(`🎶 \`${song.title}\` isimli şarkı çalıyor.`)
            .addFields(
                { name: "Kanal", value: song.author, inline: true },
                { name: "Süre", value: song.duration, inline: true },
                { name: "Görüntülemeler", value: song.views.toLocaleString(), inline: true },
                { name: "Yayınlanma", value: song.date, inline: true }
            )
            .setThumbnail(song.thumbnail)
            .setColor("Random")
            .setURL(song.url)
            .setFooter({ text: interaction.user.username + " Tarafından istendi.", iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        interaction.editReply({ embeds: [nowPlayingEmb] });
    }
}