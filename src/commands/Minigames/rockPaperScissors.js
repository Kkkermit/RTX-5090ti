const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { RockPaperScissors } = require('discord-gamecord')
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('rock-paper-scissors')
    .setDescription('Play a game of rock paper scissors with somebody')
    .addUserOption(option => 
        option.setName('user')
        .setDescription('The user you want to play with')
        .setRequired(true)
    ),
 
    async execute (interaction, client) {
        const user = interaction.options.getUser('user');
        if(user === interaction.user) return await interaction.reply({
            content: 'You cannot play against yourself',
            ephemeral: true
        })
        if(user.bot) return await interaction.reply({
            content: 'You cannot play against a bot',
            ephemeral: true
        })
 
        const Game = new RockPaperScissors({
            message: interaction,
            isSlashGame: false,
            opponent: user,
            embed: {
              title: 'Rock Paper Scissors',
              color: '#2d2d71',
              description: 'Press a button below to choose.'
            },
            buttons: {
              rock: 'Rock',
              paper: 'Paper',
              scissors: 'Scissors'
            },
            emojis: {
              rock: '🪨',
              paper: '📰',
              scissors: '✂️'
            },
            mentionUser: true,
            timeoutTime: 60000,
            buttonStyle: 'PRIMARY',
            pickMessage: 'You chose {emoji}.',
            winMessage: '**{player}** won the Game! GGs!',
            tieMessage: 'You tied! Nobody wins!',
            timeoutMessage: 'The Game was not completed! Nobody wins!',
            playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
          });
          
          Game.startGame();
          Game.on('gameOver', result => {
            return;
          });
    }
}