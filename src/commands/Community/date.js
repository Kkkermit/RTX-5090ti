const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("date")
    .setDescription("the current time and date"),
 
    async execute (interaction) {
 
        const embed = new EmbedBuilder()
        .setTitle("Time & Date")
        .addFields(
            {name: "Time:", value: `<t:${Math.floor((Date.now()) / 1000)}:T>`, inline: true},
            {name: "Date:", value: `<t:${Math.floor((Date.now()) / 1000)}:D>`, inline: true}
        )
 
        return interaction.reply({
            embeds: [embed]
        })
    }
}