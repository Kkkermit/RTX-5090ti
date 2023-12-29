const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require('discord.js');
const birthdayschema = require('../../Schemas/birthdaySetup');
const birthdays = require('../../Schemas/birthday');
const pfp = require('../../pfp.json')
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('birthday')
    .setDMPermission(false)
    .setDescription('Configure your birthday system.')
    .addSubcommand(command => command.setName('setup').setDescription('Sets up your birthday system for you.').addChannelOption(option => option.setName('channel').setDescription('Specified channel will receive your birthday notifications.').setRequired(true).addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)).addRoleOption(option => option.setName('birthday-role').setDescription('Specified role will be given to birthday users.').setRequired(false)))
    .addSubcommand(command => command.setName('disable').setDescription('Disables your birthday system.'))
    .addSubcommand(command => command.setName('remove').setDescription('Removes your birthday.'))
    .addSubcommand(command => command.setName('set').setDescription(`Sets your birthday's date.`).addStringOption(option => option.setName('month').setRequired(true).addChoices(
        { name: `• January`, value: `January`},
        { name: `• February`, value: `February`},
        { name: `• March`, value: `March`},
        { name: `• April`, value: `April`},
        { name: `• May`, value: `May`},
        { name: `• June`, value: `June`},
        { name: `• July`, value: `July`},
        { name: `• August`, value: `August`},
        { name: `• September`, value: `September`},
        { name: `• Octomber`, value: `Octomber`},
        { name: `• November`, value: `November`},
        { name: `• December`, value: `December`},
    ).setRequired(true).setDescription('Specified month will be your bithday month.')).addIntegerOption(option => option.setName('day').setRequired(true).setDescription('Specified day will be your birthday day.').setMinValue(1).setMaxValue(31))),
    async execute(interaction) {
 
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
            case 'setup':
 
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
            const data = await birthdayschema.findOne({ Guild: interaction.guild.id });
            if (data) return await interaction.reply({ content: `The **Birthday System** has **already** been set up in your server! \n> Do **/birthday disable** to undo.`, ephemeral: true });
            else {
                const channel = await interaction.options.getChannel('channel');
                const role = await interaction.options.getRole('birthday-role');
 
                const embed = new EmbedBuilder()
                .setColor("#ecb6d3")
                .setThumbnail(`${pfp}`)
                .setAuthor({ name: `🎉 Birthday System`})
                .setFooter({ text: `🎉 Birthdays Setup`})
                .setTimestamp()
                .setTitle('> Birthdays Enabled')
                .addFields({ name: `• Channel`, value: `> ${channel}`})
 
                if (role) {
                    embed.addFields({ name: `• Birthday Role`, value: `> ${role}`});
                }
 
                await interaction.reply({ embeds: [embed] });
 
                let roleid = '';
                if (role) {
                    roleid = role.id
                } else {
                    roleid = 'none'
                }
 
                await birthdayschema.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id,
                    Role: roleid
                })
 
            }
 
            break;
            case 'disable':
 
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});
            const disabledata = await birthdayschema.findOne({ Guild: interaction.guild.id });
            if (!disabledata) return await interaction.reply({ content: `The **Birthday System** has **not** been set up in your server.`, ephemeral: true });
            else {
 
                const embed = new EmbedBuilder()
                .setColor("#ecb6d3")
                .setThumbnail(`${pfp}`)
                .setAuthor({ name: `🎉 Birthday System`})
                .setFooter({ text: `🎉 Birthdays Disabled`})
                .setTimestamp()
                .setTitle('> Birthdays Disabled')
                .addFields({ name: `• Info`, value: `> Your Birthday System has been successfully \n> disabled within your server!`})
 
                await interaction.reply({ embeds: [embed] });
 
                await birthdayschema.deleteMany({ Guild: interaction.guild.id });
 
            }
 
            break;
            case 'set':
 
            const datacheck = await birthdayschema.findOne({ Guild: interaction.guild.id });
            if (!datacheck) return await interaction.reply({ content: `The **Birthday System** has **not** been set up in this server!`, ephemeral: true });
            const birthdaydata = await birthdays.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
            if (birthdaydata) return await interaction.reply({ content: `You have **already** set your **birthday** in **${interaction.guild.name}**!`, ephemeral: true });
            else {
 
                const month = await interaction.options.getString('month');
                const day = await interaction.options.getInteger('day');
 
                const day30s = ['April', 'June', 'September', 'November'];
 
                if (day > 30 && day30s.includes(month)) return await interaction.reply({ content: `The month **${month}** does **not** have over **30 days**!`, ephemeral: true });
                if (day > 28 && month === 'February') return await interaction.reply({ content: `The month **${month}** does **not** have more than **28 days**!`, ephemeral: true });
 
                let currentmonth = new Date().getMonth();
                let currentday = new Date().getDate();
                let currenthours = new Date().getHours()
                let count = 0;
 
                if (month === 'January') count = 1;
                if (month === 'February') count = 2;
                if (month === 'March') count = 3;
                if (month === 'May') count = 4;
                if (month === 'April') count = 5;
                if (month === 'June') count = 6;
                if (month === 'July') count = 7;
                if (month === 'August') count = 8;
                if (month === 'Semptember') count = 9;
                if (month === 'Octomber') count = 10;
                if (month === 'November') count = 11;
                if (month === 'December') count = 12;
 
                let time = Date.now() - currentmonth * 2629800000 - currentday * 86400000 + count * 2629800000 + day * 86400000 - 2629800000;
                if (time < Date.now()) {
                    time = time + 12 * 2629800000;
                }
 
                const embed = new EmbedBuilder()
                .setColor("#ecb6d3")
                .setThumbnail(`${pfp}`)
                .setAuthor({ name: `🎉 Birthday System`})
                .setFooter({ text: `🎉 Birthday Set`})
                .setTimestamp()
                .setTitle('> Birthday Set')
                .addFields({ name: `• Info`, value: `> Your birthday has been successfully \n> set within the **${interaction.guild.name}** server!`})
                .addFields({ name: `• Birthday Date`, value: `> **${month} ${day}** - <t:${Math.floor(time / 1000)}:R>`})
 
                await interaction.reply({ embeds: [embed] });
 
                await birthdays.create({
                    Time: time,
                    User: interaction.user.id,
                    Guild: interaction.guild.id,
                    HasRoleSince: 0
                })
 
            }
 
            break;
            case 'remove':
 
            const removedata = await birthdays.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
            if (!removedata) return await interaction.reply({ content: `You **have not** set your **birthday** in **${interaction.guild.name}**!`, ephemeral: true });
            else {
 
                await interaction.reply({ content: `Your **birthday** has been successfully **removed**!`, ephemeral: true });
                await birthdays.deleteMany({
                    Guild: interaction.guild.id,
                    User: interaction.user.id
                })
 
            }
 
        }
    }
}