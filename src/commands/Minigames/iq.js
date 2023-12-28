const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const pfp = require('../../pfp.json');
const config = require('../../config.json');
const Owner = config.owner

module.exports = {
    data: new SlashCommandBuilder()
        .setName('my-iq')
        .setDescription("Generates and provides the user's IQ"),
    async execute(interaction) {
        const minIQ = 20;
        const maxIQ = 200;
        const randomIQ = Math.floor(Math.random() * (maxIQ - minIQ + 1)) + minIQ;
        let message = `Your IQ is ${randomIQ}.`;

        if (randomIQ >= 80) {
            message = `> Your IQ is high **${randomIQ}** You're a genius! 🧠`;
        } else if (randomIQ <= 50) {
            message = `> Your IQ is low **${randomIQ}** Keep learning and growing! 📚`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.tag}'s IQ Result`)
            .setDescription('• **IQ Tracker Tool**')
            .setColor('Green')
            .setAuthor({name: '🧠 IQ Tool'})
            .setFooter({text: `🧠 IQ Tool | By ${Owner}`})
            .addFields({name: '• IQ level', value: (message)})
            .setTimestamp()
            .setThumbnail(`${pfp}`)

        await interaction.reply({ embeds: [embed] });
    },
};
