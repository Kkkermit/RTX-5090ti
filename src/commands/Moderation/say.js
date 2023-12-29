const {SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Says something by the bot")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addChannelOption(options => options.setName("channel").setDescription("THe channel you want to send the message").setRequired(false)),

        async execute(interaction) {
            let channel = interaction.options.getChannel("channel");

            if (!channel) {
                channel = interaction.channel;
            }

            let saymodal = new ModalBuilder()
                .setCustomId("say")
                .setTitle("Say something through the bot")
            
            let sayquestion = new TextInputBuilder()
                .setCustomId("say")
                .setLabel("Say something")
                .setPlaceholder("Type something...")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
            
            let sayembed = new TextInputBuilder()
                .setCustomId('embed')
                .setLabel("Embed mode on/off?")
                .setPlaceholder("on/off")
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
            


            let say = new ActionRowBuilder().addComponents(sayquestion);
            let sayemb = new ActionRowBuilder().addComponents(sayembed);

            saymodal.addComponents(say, sayemb)

            await interaction.showModal(saymodal)

            
            try {
                let response = await interaction.awaitModalSubmit({time: 300000})
                let message = response.fields.getTextInputValue('say')
                let embedsay = response.fields.getTextInputValue('embed')

                const embed = new EmbedBuilder()
                    .setDescription(message)
                    .setColor('Blue')

                
                if (embedsay === "on" || embedsay === "On") {
                    await channel.send({embeds: [embed]})
                } else {
                    await channel.send(message)
                }

                await response.reply({content: "Your message has been successfully sent", ephemeral: true})
           } catch (error) {
                console.error(error)
                return;
            }
        }

}