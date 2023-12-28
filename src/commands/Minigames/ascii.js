const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const figlet = require('figlet');
const config = require('../../config.json')
const Owner = config.owner

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ascii')
    .setDescription('Spice up your chat, with ascii art!')
    .addStringOption(option => option.setName('text').setDescription('Specified text will be converted into art.').setRequired(true).setMaxLength(15)),
    async execute(interaction) {
        const text = interaction.options.getString('text')

        figlet(`${text}`, function (err, data) {

            if (err) {
                return interaction.reply({ content: `**Oops!** Something went **extremely** wrong, try again later!`, ephemeral: true})
            }

            const embed = new EmbedBuilder()
            .setColor("Random")
            .setFooter({ text: `Ascii Art | Designed By ${Owner}`})
            .setTimestamp()
            .setDescription(`\`\`\`${data}\`\`\``)

            interaction.reply({ embeds: [embed] });
        
        });
    }
}