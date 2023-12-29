const {SlashCommandBuilder, EmbedBuilder} =require('discord.js');
const pfp = require('../../pfp.json')
const config = require('../../config.json')
const Owner = config.owner

module.exports={
    data: new SlashCommandBuilder()
      .setName('econ-commands')
      .setDescription('Lists all the commands that can be executed for the economy system'), 
    
      async execute(interaction){
        
        const{guild} = interaction;
        const{members} = guild;
        const{name} = guild;
        const icon = guild.iconURL() || `${pfp}`

        const embed = new EmbedBuilder()
        .setTitle('**🟡List of commands for the economy system**')
        .setColor("Yellow")
        .setAuthor({ name: name, iconURL: icon})
        .setFooter({ text: `🟡Economy tracker | Designed by ${Owner}`})
        .setThumbnail(`${pfp}`)
        .setDescription(`**Econ-commands**`)
        .setTimestamp()
        .addFields({ name: "• /bal", value: "\n> Shows a users balance", inline: false})
        .addFields({ name: "• /beg", value: "\n> initiate begging sequence", inline: false})
        .addFields({ name: "• /daily", value: "\n> gives the user a daily allownce", inline: false})
        .addFields({ name: "• /deposit", value: "\n> deposits a users money into the bank", inline: false})
        .addFields({ name: "• /economy", value: "\n> opens an account in the economy", inline: false})
        .addFields({ name: "• /withdraw", value: "\n> withdraws a users money from the bank", inline: false})
        .addFields({ name: "• /rob", value: "\n> Robs another user from the money in their wallet", inline: false})
        
        
        await interaction.reply({embeds: [embed]});
      }

}