const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const pfp = require('../../pfp.json')
const config = require('../../config.json')
const Owner = config.owner

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unmute')
    .setDMPermission(false)
    .setDescription('Untimesout specified user for specified amount of time.')
    .addUserOption(option => option.setName('user').setDescription('Specified user will be untimed out.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription(`Provide the reason as to why you want the user to be untimed out.`).setRequired(false)),
    async execute(interaction) {

        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason') || 'No reason provided :(';
        const username = interaction.options.getUser('user');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});

        user.timeout(null).catch(err => {
            return interaction.reply({ content: `**Couldn't** un-timeout this member! Check my **role position** and try again.`, ephemeral: true})
        })

        const dmembed = new EmbedBuilder()
        .setColor("DarkRed")
        .setAuthor({ name: '🔨 Timeout Tool'})
        .setTitle(`> You were unmuted from "${interaction.guild.name}"`)
        .addFields({ name: '• Server', value: `> ${interaction.guild.name}`, inline: true})
        .addFields({ name: '• Reason', value: `> ${reason}`, inline: true})
        .setFooter({ text: `🔨 The time clock forgave you | Designed By ${Owner}`})
        .setTimestamp()
        .setThumbnail(`${pfp}`)

        const embed = new EmbedBuilder()
        .setColor("DarkRed")
        .setAuthor({ name: '🔨 Timeout Tool'})
        .setTitle(`> User was unmuted!`)
        .addFields({ name: '• User', value: `> ${username.tag}`, inline: true})
        .addFields({ name: '• Reason', value: `> ${reason}`, inline: true})
        .setThumbnail(`${pfp}`)
        .setFooter({ text: `🔨 The time clock missed | Designed By ${Owner}`})

        await interaction.reply({ embeds: [embed] })
        await user.send({ embeds: [dmembed] }).catch(err => {
            return;
        })
    }
}