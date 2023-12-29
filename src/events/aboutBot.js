const { Events, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require("discord.js");
  const pfp = require('../pfp.json')
  
  module.exports = {
    name: Events.MessageCreate,
  
    async execute(message, client, interaction) {
      if (message.author.bot) return;
      if (message.content.includes("<@1189630675918262282"))  {
         
         
        const pingEmbed = new EmbedBuilder()
        
          .setColor("Purple")
          .setTitle("🏓 • Who mentioned me??")
          .setDescription(
            `Hey there **${message.author.username}**!, here is some useful information about me.\n ⁉️ • **How to view all commands?**\nEither use **/help-manual** or do / to view a list of all the commands!`
          )
          .addFields({ name: '**🌐 • Website:**', value: 'https://orbit-exe.xyz/'})
          .addFields({ name: `**🏡 • Servers:**`, value: `${client.guilds.cache.size}`, inline: true })
          .addFields({ name: `**👥 • Users:**`, value: `${client.guilds.cache.reduce((a,b) => a+b.memberCount, 0)}`, inline: true})
          .addFields({ name: `**💣 • Commands:**`, value: `${client.commands.size}`, inline: true})
          .setTimestamp()
          .setThumbnail(`${pfp}`)
          .setFooter({text: `Requested by ${message.author.username}.`})

         const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setEmoji("➕")
            .setLabel("Join Support Server")
            .setURL(
                "https://discord.gg/xcMVwAVjSD"
            )
            .setStyle(ButtonStyle.Link)
        );
  
        return message.reply({ embeds: [pingEmbed], components: [buttons] });
      }
    },
  };