const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType} = require("discord.js");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Announce something in the server!")
    .addChannelOption(option => option
        .setName("channel")
        .setDescription("The announcement channel")
        .addChannelTypes(ChannelType.GuildAnnouncement)
        .setRequired(true)
    )
    .addStringOption(option => option
        .setName("title")
        .setDescription("The title of the announcement")
        .setRequired(false)
    )
    .addStringOption(option => option
        .setName("description")
        .setDescription("The description of this announcement")
        .setRequired(false)
    ),
 
    async execute (interaction, client) {
       const channelID = interaction.options.getChannel("channel");
 
        const desc = interaction.options.getString("description") || "test announce";
 
        const title = interaction.options.getString("title") || "NEW ANNOUNCEMENT!";
 
        const userx = interaction.user.id;
 
        const embed = new EmbedBuilder()
        .setTitle(`${title}`)
        .setDescription(`${desc}`)
        .addFields({ name: "Moderator:", value: `<@${userx}>`, inline: false})
        .setTimestamp()
 
        const channel = interaction.client.channels.cache.get(`${channelID.id}`);
 
        channel.send({
            embeds: [embed]
        }).catch(err => {
            return;
        });
 
        return interaction.reply({content: `The Announcement has been send in <#${channelID.id}>`, ephemeral: true});
    }
}
    