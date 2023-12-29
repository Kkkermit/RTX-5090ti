const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const warningSchema = require("../../Schemas/warnSchema");
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear-warnings')
    .setDescription('This clears a members warnings')
    .addUserOption(option => option.setName("user").setDescription("The user you want to clear the warnings of").setRequired(true)),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
 
        const { options, guildId, user } = interaction;
 
        const target = options.getUser("user");
        
        const embed = new EmbedBuilder()
 
        warningSchema.findOne({ GuildID: guildId, UserID: target.id, UserTag: target.tag }, async (err, data) => {
 
            if (err) throw err;
 
            if (data) {
                await warningSchema.findOneAndDelete({ GuildID: guildId, UserID: target.id, UserTag: target.tag})
 
                embed.setColor("Blue")
                .setDescription(`🔴 ${target.tag}'s warnings have been cleared`)
 
                interaction.reply({ embeds: [embed] });
            } else {
                interaction.reply({ content: `${target.tag} has no warnings to be cleared`, ephemeral: true });
            }
        });
    }
}