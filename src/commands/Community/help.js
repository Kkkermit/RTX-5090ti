const { SlashCommandBuilder, StringSelectMenuBuilder, PermissionsBitField, ButtonStyle, ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
var timeout = [];
const config = require('../../config.json')
const BotName = config.botName
const pfp = require('../../pfp.json')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Cannot find what you were wishing to? Check this out!')
    .addSubcommand(command => command.setName('server').setDescription(`Join our official support server for ${BotName}!`))
    .addSubcommand(command => command.setName('manual').setDescription('Get some information on our bot commands and plans.')),
    async execute(interaction, client) {

        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case 'server':

            const button = new ActionRowBuilder()
            .addComponents(
            new ButtonBuilder()
            .setLabel('Support Server')
            .setStyle(ButtonStyle.Link)
            .setURL("https://discord.gg/xcMVwAVjSD")
            )
        

            const embedhelpserver = new EmbedBuilder()
            .setColor("DarkOrange")
            .setTitle('> Join the support server for \n> further help!')
            .setFooter({ text: `🧩 Support server`})
            .setTimestamp()
            .setAuthor({ name: `🧩 Support server Command`})
            .setThumbnail(`${pfp}`)
            .addFields({ name: `• Manual link to the Discord server:`, value: `> https://discord.gg/xcMVwAVjSD`})
        
            await interaction.reply({ embeds: [embedhelpserver], components: [button] })

            break;
            case 'manual':

            const helprow1 = new ActionRowBuilder()
            .addComponents(

            new StringSelectMenuBuilder()
            .setMinValues(1)
            .setMaxValues(1)
            .setCustomId('selecthelp')
            .setPlaceholder('• Select a menu')
            .addOptions(
                {
                    label: '• Help Center',
                    description: 'Navigate to the Help Center.',
                    value: 'helpcenter',
                },

                {
                    label: '• How to add the bot',
                    description: `Displays how to add ${BotName} to your amazing server.`,
                    value: 'howtoaddbot'
                },

                {
                    label: '• Feedback',
                    description: `Displays how to contribute to the devlopment of ${BotName} by giving feedback.`,
                    value: 'feedback'
                },

                {
                    label: '• Commands Help',
                    description: 'Navigate to the Commands help page.',
                    value: 'commands',
                },
            ),
        );

        const embed = new EmbedBuilder()
        .setColor("DarkOrange")
        .setTitle('> Get Help')
        .setAuthor({ name: `🚑 Help Command`})
        .setFooter({ text: `🚑 Help command: Help Center`})
        .setThumbnail(`${pfp}`)
        .addFields({ name: `• Commands Help`, value: `> Get all **Commands** (**${client.commands.size}**) purposes.`})
        .setTimestamp()

        await interaction.reply({ embeds: [embed], components: [helprow1] });
           
        }
    }
}