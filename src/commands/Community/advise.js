const { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, } = require("discord.js");
const pfp = require('../../pfp.json');
const config = require('../../config.json');
const Owner = config.owner

  const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("advice")
      .setDescription("Get random advice."),
    async execute(interaction) {
      const data = await fetch("https://api.adviceslip.com/advice").then((res) =>
        res.json()
      );
      
      const embed = new EmbedBuilder()
      .setTimestamp()
      .setThumbnail(`${pfp}`)
      .setTitle('> Advice Given')
      .setFooter({ text: `🤝 Advice Fetched | Designed By ${Owner}`})
      .setAuthor({ name: `🤝 Advice Randomizer`})
      .addFields({ name: `• Advice`, value: `> ${data.slip.advice}`})
      .setColor("DarkBlue")

      await interaction.reply({embeds: [embed]});
    },
  };
  