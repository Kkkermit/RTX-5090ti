const {SlashCommandBuilder, EmbedBuilder, PermissionsBitField}= require ('discord.js');

module.exports={
    data: new SlashCommandBuilder()
    .setName('add-sticker')
    .setDescription('Add a sticker to the server')
    .addAttachmentOption(option => option.setName('sticker').setDescription('Upload the sticker png/jpeg').setRequired(true))
    .addStringOption(option => option.setName('name').setDescription('The name of the sicker').setRequired(true)), 
    async execute (interaction){

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: 'You **do not** have the permission to do that!', ephemeral: true});

        const upload = interaction.options.getAttachment('sticker');
        const name = interaction.options.getString('name');

        if (name.length <=2) return await interaction.reply({ content: `Your name has to be greater than 2 characters`, ephemeral: true});
        if (upload.contentType === 'image/gif') return await interaction.reply({ content: `You cannot upload gif files at this time`, ephemeral});

        await interaction.reply(`Loading your sticker...`);

        const sticker = await interaction.guild.stickers.create({ file: `${upload.attachment}`, name: `${name}`}).catch(err => {
            setTimeout(() =>{
             return interaction.editReply({ content: `${err.rawError.message}`});
            }, 2000);

            
        });

        const embed = new EmbedBuilder()
        .setColor("Aqua")
        .setDescription(`Your sticker has been added with the name \`${name}\``)

        setTimeout(() => {
            if (!sticker) return;

            interaction.editReply({ content: ``, embeds: [embed]});
        }, 3000);
            
        

    }
}