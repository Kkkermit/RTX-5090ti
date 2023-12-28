const {SlashCommandBuilder, EmbedBuilder}=require('discord.js');
const config = require('../../config.json');
const Owner = config.owner

module.exports={
    data:new SlashCommandBuilder()
    .setName('master-oogway')
    .setDescription("shares part of oogways wisdom")
    .addStringOption(option => option.setName('quote').setDescription('Your choice').setRequired(true)),

    async execute(interaction){
        const quote = interaction.options.getString('quote');
        let canvas = `https://some-random-api.com/canvas/misc/oogway?quote=${encodeURIComponent(quote)}`;

        const embed = new EmbedBuilder()
        .setTitle("🐢 Oogway's Wisdom!")
        .setImage(canvas)
        .setFooter({ text: `🐢 Master Oogway's Quotes of Wisdom | Designed By ${Owner}`})
        .setTimestamp()
        .setColor("DarkNavy");

        await interaction.reply({ embeds: [embed]});
    }
}