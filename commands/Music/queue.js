const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription("Kuyruğa eklenen şarkıları gösterir."),
    async execute(interaction) {
        
        if (!interaction.client.queue ||interaction.client.queue.length === 0) {
            return interaction.reply({ content: 'Kuyrukta şarkı yok.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('Random')
            .setAuthor({name: `${interaction.guild.name} | Şarkı Kuyruğu`, iconURL: interaction.guild.iconURL()})
            .setDescription(`${interaction.client.queue
                .map((song, index) => index + 1 + ". " + song.title)
                .join("\n")}`
            )
            .setFooter({text: `${interaction.user.username} tarafından istendi.`, iconURL: interaction.user.displayAvatarURL()})
            .setTimestamp()

        interaction.reply({ embeds: [embed] });
    }
}