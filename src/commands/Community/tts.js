const {SlashCommandBuilder, PermissionsBitField, EmbedBuilder}= require('discord.js');


module.exports={
    data: new SlashCommandBuilder()
    .setName('tts')
    .setDescription('Sends a text to speech message in the server')
    .addStringOption(option => 
        option.setName('message').setDescription('The message you want to send').setRequired(true)),
        async execute(interaction){

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.SendTTSMessages)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});

            const { options } = interaction;
            const message = options.getString('message');

            await interaction.reply({ content: `${message}`, tts: true});
        }
         
}
