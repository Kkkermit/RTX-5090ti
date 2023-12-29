const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kanye-quote')
    .setDescription('Sends a quote from Kanye West'),

  async execute(interaction) {
      const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    const res = await fetch('https://api.kanye.rest');
    const { quote: kanyequote } = await res.json();

    const embed = new EmbedBuilder()
      .setTitle('Right from Kanye West ')
      .setDescription(`> ${kanyequote}`)
      .setThumbnail('https://68.media.tumblr.com/56d36968f6b231ea2d133c852689f532/tumblr_oh6ra7kmhu1rvtprso1_500.gif')
      .setFooter({text: '🗣️ • God Bless!' })
      .setTimestamp()
      .setAuthor({name: '🗣️ • Kanye Quotes'})
    await interaction.reply({ embeds: [embed] });
  }
};