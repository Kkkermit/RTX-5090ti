const { SlashCommandBuilder,EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pp-size')
        .setDescription('Shows the size of your pp.'),
    async execute(interaction) {
        const penisSize = Math.floor(Math.random() * 10) + 1;
        let penismain = '8';
        for (let i = 0; i < penisSize; i++) {
            penismain += '=';
        }

        
        const penisEmbed = new EmbedBuilder()
            .setColor('Blue')
            .setTitle(`${interaction.user.username}'s pp Size 😶`)
            .setDescription(`Your penis size is  ${penismain}D`);

        await interaction.reply({ embeds: [penisEmbed] });
    },
};
