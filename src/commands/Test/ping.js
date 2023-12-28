const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const pfp = require('../../pfp.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'), 
    async execute(interaction) {

        const pingbed = new EmbedBuilder()
        .setTitle('Pong!')
        .setTimestamp()
        .setImage(`${pfp}`)

        await interaction.reply({ embeds: [pingbed]})
    }

}