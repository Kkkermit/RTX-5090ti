const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionsBitField, } = require("discord.js");
  const levelSchema = require(`../../Schemas/level`);
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName(`xp-reset`)
      .setDescription(`Resets ALL of the servers xp`),
      
    async execute(interaction) {
        const perm = new EmbedBuilder()
        .setColor('Random')
        .setDescription(`<:sad:1190016420004765806> You dont have permission to reset xp levels in this server`)
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true });

        const { guildId } = interaction;


        levelSchema.deleteMany({ Guild: guildId }, async (err, data) => {

            const embed = new EmbedBuilder()
            .setColor('Random')
            .setDescription(`<:sad:1190016420004765806> Xp system is reset`)
            
            await interaction.reply({ embeds: [embed] })
        })

    }
}