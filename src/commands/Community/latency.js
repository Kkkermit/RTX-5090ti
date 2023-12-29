const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    ownerOnly: true, // Makes the command owner-only.
    data: new SlashCommandBuilder()
    .setName('latency')
    .setDescription('View the speed of the bot\'s response.')
    .setDMPermission(false),
    async execute(interaction, client) {
        const icon = interaction.user.displayAvatarURL();
        const tag = interaction.user.tag;

        const embed = new EmbedBuilder()
        .setTitle('**`Lantency test`**')
        .setDescription(`**\`🍯・LATENCY: ${interaction.client.ws.ping} ms\`**`)
        .setColor("Yellow")
        .setFooter({ text: `Requested by ${tag}`, iconURL: icon })
        .setTimestamp()

        const btn = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('btn')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🔁')
        )

        const msg = await interaction.reply({ embeds: [embed], components: [btn] })

        const collector = msg.createMessageComponentCollector()
        collector.on('collect', async i => {
            if(i.customId == 'btn') {
                i.update({ embeds: [
                    new EmbedBuilder()
                    .setTitle('**`Lantency test`**')
                    .setDescription(`**\`🍯・LATENCY: ${interaction.client.ws.ping} ms\`**`)
                    .setColor("Yellow")
                    .setFooter({ text: `Requested by ${tag}`, iconURL: icon })
                    .setTimestamp()
                ], components: [btn] })
            }
        })
    }
}