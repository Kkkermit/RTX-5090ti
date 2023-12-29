const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hack')
    .setDescription('Hack the mentioned user. "it\'s fake so no worries."')
    .addUserOption(option => option
                  .setName('user')
                  .setDescription('The mentioned user will get hacked.')
                  .setRequired(true)
                  ),
    async execute(interaction) {
        const target = await interaction.options.getUser(`user`);
        if(!target) return await interaction.reply({ content: '**Who are you gonna hack? Hack the air? Mention a user dude!**' })
        
        await interaction.reply({ content: `Running the process to hack ${target}..` })
        await wait(2500);
        await interaction.editReply({ content: `Getting the process ready..` })
        await wait(2500);
        await interaction.editReply({ content: `Installing application on ${target} devices..` })
        await wait(2500);
        await interaction.editReply({ content: `Getting ${target} devices password and ID..` })
        await wait(2500);
        await interaction.editReply({ content: `Stealing ${target} mom credit card..` })
        await wait(2500);
        await interaction.editReply({ content: `Hacking ${target} computer and Wi-Fi..` })
        await wait(2500);
        await interaction.editReply({ content: `Getting ${target} location, name, passwords, personal informations..` })
        await wait(2500);
        await interaction.editReply({ content: `Exposing ${target}'s personal informations, mom credit card and Wi-Fi..'` })
        await wait(3000);
        await interaction.editReply({ content: `Mission complete! I've successfully hacked ${target} devices, and exposed everything he has!` })
    }
}