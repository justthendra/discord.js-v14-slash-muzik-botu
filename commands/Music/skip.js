const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ytdl = require('@distube/ytdl-core');
const { createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Çalan şarkıyı atlar ve sıradaki şarkıya geçer.'),
    async execute(interaction) {
        await interaction.deferReply();

        if (!interaction.client.player || !interaction.client.queue) {
            return interaction.editReply('Şu anda çalan bir şarkı yok veya çalma sırası boş!');
        }

        const nextSong = interaction.client.queue.shift();
        if (nextSong) {
            playSong(nextSong.url, interaction);
            return interaction.editReply('Şarkı atlandı, sıradaki şarkı çalınıyor.');
        } else {
            interaction.client.player.stop();
            interaction.client.connection.destroy();
            return interaction.editReply('Çalma sırası boş, ses kanalından ayrılıyorum.');
        }
    },
};

async function playSong(songUrl, interaction) {
    try {
        const stream = await ytdl(songUrl, { filter: 'audioonly', highWaterMark: 1 << 25 });
        const resource = createAudioResource(stream, { inlineVolume: true });
        interaction.client.player.play(resource);

        let info;
        try {
            info = await ytdl.getBasicInfo(songUrl);
        } catch (error) {
            console.error('Şarkı bilgileri alınırken bir hata oldu:', error);
            return;
        }

        const formatDuration = (duration) => {
            const seconds = duration % 60;
            const minutes = Math.floor(duration / 60) % 60;
            const hours = Math.floor(duration / 3600);
            return `${hours ? hours + ':' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        };

        const song = {
            title: info.videoDetails.title,
            url: info.videoDetails.video_url,
            duration: formatDuration(parseInt(info.videoDetails.lengthSeconds)),
            thumbnail: info.videoDetails.thumbnails[0].url,
            author: info.videoDetails.author.name,
            views: info.videoDetails.viewCount,
            date: new Date(info.videoDetails.publishDate).toLocaleDateString()
            /*likes: {
                trues: info.videoDetails.likes.toLocaleString(),
                falses: info.videoDetails.dislikes.toLocaleString()
            }*/
        };

        interaction.client.currentSong = song;

        const playEmb = new EmbedBuilder()
            .setTitle(`${song.title} | ${song.author}`)
            .setDescription(`🎶 \`${song.title}\` isimli şarkı çalıyor.`)
            .addFields(
                { name: "Kanal", value: song.author, inline: true },
                { name: "Süre", value: song.duration, inline: true },
                { name: "Görüntülemeler", value: song.views.toString(), inline: true },
                { name: "Yayınlanma", value: song.date, inline: true }
            )
            .setThumbnail(song.thumbnail)
            .setColor("Random")
            .setURL(song.url)
            .setFooter({ text: interaction.user.username + " Tarafından istendi.", iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();
        interaction.editReply({ embeds: [playEmb] });

        const player = interaction.client.player;

        player.on(AudioPlayerStatus.Idle, () => {
            const nextSong = interaction.client.queue.shift();
            if (nextSong) {
                playSong(nextSong.url, interaction);
            } else {
                interaction.client.connection.destroy();
            }
        });
    } catch (err) {
        console.log('Şarkı açılırken bir hata oldu:', err);
        interaction.client.connection.destroy();
        interaction.editReply({ content: 'Şarkı açılırken bir hata oldu.' });
    }
}