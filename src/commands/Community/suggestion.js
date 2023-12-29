const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("suggest")
    .setDescription("Suggest for a feature the bot should have")
    .addStringOption(option => option
        .setName("suggestion")
        .setDescription("The suggestion")
        .setRequired(true)
    ),
 
    async execute (interaction, client) {
 
        const suggestion = interaction.options.getString("suggestion");
        const userx = interaction.user.id;
 
        const embed = new EmbedBuilder()
        .setTitle("NEW SUGGESTION!")
        .setColor("Green")
        .addFields({ name:"User: ", value:`<@${userx}>`, inline: false})
        .setDescription(`${suggestion}`)
        .setTimestamp()
 
        const xEmbed = new EmbedBuilder()
        .setTitle("You send us a suggestion!")
        .setDescription(`${suggestion}`)
        .setColor("Green")
 
        const channel = interaction.client.channels.cache.get('938454928630890537');
                                                  
        channel.send({
            embeds: [embed]
        }).catch(err => {
            return;
        });
 
        return interaction.reply({ embeds: [xEmbed], ephemeral: true}).catch(err => {
            return;
        });
 
 
    }
}
