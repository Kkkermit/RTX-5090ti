const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const khaledquotes = require('../../khaledQuotes.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('khaled-quotes')
    .setDescription('Gives you a random quote from DJ Khaled.'),
    async execute(interaction) {

        const randomizer = Math.floor(Math.random() * khaledquotes.length);

        const khalbed = new EmbedBuilder()
        .setAuthor({ name: `🗣️ • Khaled Quotes`})
        .setFooter({ text: `🗣️ • God did`})
        .setTitle('Right From DJ Khaled himself!')
        .setThumbnail('https://media.tenor.com/6Exkhhjc4HgAAAAd/dj-khaled.gif')
        .setTimestamp()
        .setDescription(`> ${khaledquotes[randomizer]}`)

        await interaction.reply({ embeds: [khalbed] });
    }
}