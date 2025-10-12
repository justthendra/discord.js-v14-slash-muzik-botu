const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { createAudioPlayer, createAudioResource, joinVoiceChannel, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');
const ytpl = require('ytpl');
const youtubeSearchApi = require('youtube-search-api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription("Bir müzik veya çalma listesini çalın.")
        .addStringOption(link =>
            link.setName("link_or_name")
                .setDescription("Bir link belirtmen lazım.")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        if (!interaction.member.voice.channel) {
            return interaction.editReply({ content: "Ses kanalında değilsin. Lütfen ses kanalına bağlan.", ephemeral: true });
        }

        const input = interaction.options.getString('link_or_name');
        let url;

        if (ytdl(input) || ytpl.validateID(input)) {
            url = input;
        } else {
            // Perform a search for the song name
            try {
                const searchResults = await youtubeSearchApi.GetListByKeyword(input, false);
                if (searchResults.items.length > 0) {
                    const video = searchResults.items[0];
                    url = `https://www.youtube.com/watch?v=${video.id}`;
                } else {
                    return interaction.editReply({ content: 'Aramanızla eşleşen şarkı bulunamadı.' });
                }
            } catch (error) {
                console.log('Şarkı araması yapılırken bir hata oldu:' + error);
                return interaction.editReply({ content: 'Şarkı araması yapılırken bir hata oldu.' });
            }
        }

        let connection;
        try {
            connection = joinVoiceChannel({
                channelId: interaction.member.voice.channel.id,
                guildId: interaction.guild.id,
                adapterCreator: interaction.guild.voiceAdapterCreator
            });

            connection.on(VoiceConnectionStatus.Ready, () => {
                console.log('Ses kanalına bağlandım!');
            });

            connection.on(VoiceConnectionStatus.Disconnected, () => {
                connection.destroy();
                console.log('Ses kanalından ayrıldım!');
            });

        } catch (error) {
            console.log('Ses kanalına bağlanırken bir hata oldu:' + error);
            return interaction.editReply({ content: 'Ses kanalına bağlanırken bir hata oldu.' });
        }

        if (!interaction.client.queue) {
            interaction.client.queue = [];
        }

        let info;
                try {
                    info = await ytdl.getBasicInfo(url);
                } catch (error) {
                    console.log('Şarkı bilgileri alınırken bir hata oldu:' + error);
                    return;
                }

        if (interaction.client.player && interaction.client.player.state.status !== AudioPlayerStatus.Idle) {
            interaction.client.queue.push({
                title: info.videoDetails.title,
                url: info.videoDetails.video_url
            });
            return interaction.editReply({ content: 'Şarkı kuyruğa eklendi.' });
        } else {
            playSong(url, interaction);
        }

        async function playSong(songUrl) {
            try {
                const stream = await ytdl(songUrl, { filter: 'audioonly', highWaterMark: 1 << 25 });
                const resource = createAudioResource(stream, { inlineVolume: true });
                const player = createAudioPlayer();
                player.play(resource);
                connection.subscribe(player);


                interaction.client.resource = resource;

                let info;
                try {
                    info = await ytdl.getBasicInfo(songUrl);
                    interaction.client.currentSong = info;
                } catch (error) {
                    console.log('Şarkı bilgileri alınırken bir hata oldu:' + error);
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
                    { name: "Görüntülemeler", value: song.views.toLocaleString(), inline: true },
                    //{ name: "Like", value: song.likes.trues },
                    //{ name: "Dislike", value: song.likes.falses },
                    { name: "Yayınlanma", value: song.date, inline: true }
                )
                .setThumbnail(song.thumbnail)
                .setColor("Random")
                .setURL(song.url)
                .setFooter({ text: interaction.user.username + " Tarafından istendi.", iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();
                interaction.editReply({ embeds: [playEmb] });

                player.on(AudioPlayerStatus.Idle, () => {
                    const nextSong = interaction.client.queue.shift();
                    if (nextSong) {
                        playSong(nextSong.url, interaction);
                    } else {
                        connection.destroy();
                    }
                });
                
                interaction.client.player = player;

            } catch (err) {
                console.log('Şarkı açılırken bir hata oldu:' + err);
                interaction.client.currentSong = null;
                connection.destroy();
                interaction.editReply({ content: 'Şarkı açılırken bir hata oldu.' });
            }
        }

        interaction.client.connection = connection;
        interaction.client.loop = false;
    }

}
