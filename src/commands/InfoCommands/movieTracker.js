const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios')
const config = require('../../config.json')
const Owner = config.owner
const APIKEY = process.env.APIKEY;

module.exports = {
    data: new SlashCommandBuilder() 
        .setName('movie-tracker')
        .setDescription('Gets information about a movie')
        .addStringOption(option => option.setName('name').setDescription('The name of the movie').setRequired(true)),

        async execute(interaction, client) {

            const apiKey = APIKEY

            const { options, member, guild } = interaction;
            const name = options.getString("name")
            const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(
                name
              )}`
            const response = await axios.get(apiUrl); {
            const movie = response.data.results[0]

           if (movie) {

            const embed = new EmbedBuilder()
            .setAuthor({name: `Track Movies Command | By ${Owner}`, iconURL: guild.iconURL({ size: 1024 })})
            .setTitle(`**TITLE**: ${movie.title}`)
            .setImage(`https://image.tmdb.org/t/p/w500${movie.poster_path}`)
            .addFields(
                {name: "**Release Date**", value: `${movie.release_date}`},
                {name: "**Overview**", value: `${movie.overview}`},
                {name: "**Popularity**", value: `${movie.popularity} /100`},
                {name: "**Language**", value: `${movie.original_language}`},
                {name: "**Average Vote**", value: `${movie.vote_average} /10`},
                {name: "**Age Rating**", value: `Adult - ${movie.adult}`})
            .setFooter({text: `Movie-Tracker | By ${Owner}`, iconURL: member.displayAvatarURL()})
            .setColor("Orange")
            .setTimestamp();

            await interaction.reply({ embeds: [embed]})
            .catch((err) => {
                interaction.editReply({ content: `An **error** occured!\n> **Error**: ${err}`, ephemeral: true});
            });

             } else {
                await interaction.reply({ content: "A movie with that title doesn't exist. Make sure you've got the correct title :)"})
             }

        } 
}}