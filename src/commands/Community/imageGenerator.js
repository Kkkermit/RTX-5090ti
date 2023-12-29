// npm i superagent
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const superagent = require('superagent');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('image-generate')
    .setDescription('Generate an image using AI')
    .addStringOption(o => o.setName('prompt').setDescription('Describe your image here').setRequired(true)),
    async execute (interaction) {
        await interaction.reply({ content: `Loading your image! This can take up to **5 minutes**!`})
 
        const prompt = interaction.options.getString(`prompt`);
 
        let image = await superagent.post(`https://backend.craiyon.com/generate`)
        .send({
           prompt: `${prompt}` 
        })
 
        const buffer = Buffer.from(image.body.images[0], 'base64');
 
        const attachment = new AttachmentBuilder(buffer, { name: 'image.png' })
 
        const embed = new EmbedBuilder()
        .setColor('Orange')
        .setImage(`attachment://image.png`)
        .setTitle(`Image Based On: ${prompt}`)
        .setTimestamp()
 
        await interaction.editReply({ content: '', embeds: [embed], files: [attachment] })
 
    }
}
