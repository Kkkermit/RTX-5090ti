const {SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { options } = require('superagent');
const config = require('../../config.json');
const Owner = config.owner

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mc-skin')
    .setDescription('Minecraft skin')
    .addStringOption(option =>
      option.setName('username')
        .setDescription('Minecraft username')
        .setRequired(true)),

  async execute(interaction) {
    const username = interaction.options.getString('username');

    const embed = new EmbedBuilder()
      .setTitle('Minecraft Skin')
      .setImage(`https://minotar.net/body/${username}/100.png`)
      .setColor('2F3136')
      .setDescription(`The skin of **${username}**`)
      .setFooter({ text: `MC Skin | Designed By ${Owner}`})
      .setTimestamp();
      

    await interaction.reply({ embeds: [embed] });
  }
};