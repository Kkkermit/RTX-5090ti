const wiki=require('wikijs').default();
const {SlashCommandBuilder, EmbedBuilder}= require('discord.js');
const config = require('../../config.json');
const Owner = config.owner

module.exports={
    data: new SlashCommandBuilder()
    .setName('wiki')
    .setDescription('Ask Wiki a question')
    .addStringOption(option => option.setName(`query`).setDescription(`Look something up on Wiki`).setRequired(true)),
    async execute(interaction){
        const query=interaction.options.getString(`query`);
        await interaction.deferReply();

        const search=await wiki.search(query);
        if (!search.results.length) return await interaction.editReply({ content: `Wikipedia doesn't seem to know what you are talking about...`, ephemeral: true});

        const result=await wiki.page(search.results[0]);

        const summary=await result.summary();
        if (summary.length > 8192) return await interaction.editReply({content: `${summary.slice(0, 2048)}`, ephemeral});
        else {
            const embed=new EmbedBuilder()
            .setColor("Purple")
            .setTitle(`Wiki search: ${result.raw.title}`)
            .setDescription(`\`\`\`${summary.slice(0, 2048)}\`\`\``)
            .setFooter({ text: `Designed By ${Owner}`})

            await interaction.editReply({ embeds: [embed]});

        }
    }
}