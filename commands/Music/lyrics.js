const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Çalan şarkının sözlerini gösterir.'),
    async execute(interaction) {
        const songName = interaction.client.currentSong; // Çalan şarkının adını alın

        if (!songName) {
            return interaction.reply({ content: 'Şu anda hiçbir şarkı çalmıyor.', ephemeral: true });
        }

        // Genius API'ye istek gönderin
        const response = await fetch(`https://api.genius.com/search?q=${encodeURIComponent(songName.title)}`, {
            headers: {
                'Authorization': `Bearer E2X2SIh3z-mfZj5B5v8eZ1EbOyxoiZEHhtG2gr-5vzkrHn3bEinC9r0ni_k5wJin`, // Genius API erişim belirtecinizi buraya ekleyin
            },
        });

        if (!response.ok) {
            return interaction.reply({ content: 'Şarkı sözleri bulunamadı.', ephemeral: true });
        }

        const data = await response.json();

        if (!data.response.hits.length) {
            return interaction.reply({ content: 'Şarkı sözleri bulunamadı.', ephemeral: true });
        }

        const songUrl = data.response.hits[0].result.url;

        interaction.reply({ content: `Şarkı Sözleri: ${songUrl}`, ephemeral: true });
    },
};