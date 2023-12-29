const { SlashCommandBuilder, EmbedBuilder }=require('discord.js'); 
const config = require('../../config.json');
const Owner = config.owner

module.exports={
    data: new SlashCommandBuilder()
    .setName('animal-fact')
    .setDescription('Gives you an animal fact!'), 
    async execute(interaction){

        async function animalfact(){
            await fetch(`https://www.reddit.com/r/animalfacts1935943924/random/.json`)
            .then (async r=> {
                let animalfact = await r.json();

                let title = animalfact[0].data.children[0].data.title;
                let image = animalfact[0].data.children[0].data.url;
                let author = animalfact[0].data.children[0].data.author;

                const animalfactembed = new EmbedBuilder()
                .setColor("Fuchsia")
                .setTitle(`${title}`)
                .setImage(`${image}`)
                .setURL(`${image}`)
                .setFooter({ text: "Animal Facts | Designed by Kkermit" })

                await interaction.reply({ embeds: [animalfactembed]});


            })
        }
        animalfact();
    }
}