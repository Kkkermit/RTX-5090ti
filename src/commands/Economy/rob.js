const { SlashCommandBuilder, EmbedBuilder, embedLength } = require('discord.js'); 
const ecoSchema = require('../../Schemas/economy');
 
var timeout = [];
module.exports = {
    data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Rob a person money')
    .addUserOption(option => option.setName('user') .setDescription('Pick the user who you want to rob') .setRequired(true)),
    async execute (interaction) {
 
        const { options, user, guild } = interaction
        if (timeout.includes(interaction.user.id)) return await interaction.reply({ content: 'Wait 1 minute to rob another user again', ephemeral: true });
 
        const userStealing = options.getUser('user');
 
        let Data = await ecoSchema.findOne({ Guild: guild.id, User: user.id });
        let DataUser = await ecoSchema.findOne({ Guild: guild.id, User: userStealing.id });
 
        if (!Data) return await interaction.reply({ content: 'Please create an economy account first', ephemeral: true });
        if (userStealing == interaction.user) return await interaction.reply({ content: 'You cannot rob yourself!', ephemeral: true });
        if (!DataUser) return await interaction.reply({ content: 'That user does not have an economy account created', ephemeral: true });
        if (DataUser.Wallet <= 0) return await interaction.reply({ content: 'That user does not have any money in their wallet', ephemeral: true });
 
        let negative = Math.round((Math.random() * -150) - 10);
        let positive = Math.round((Math.random() * 300) - 10);
 
        const posN = [negative, positive];
 
        const amount = Math.round(Math.random() * posN.length);
        const value = posN[amount];
 
        if (Data.Wallet <= 0) return await interaction.reply({ content: 'You cannot rob this person because your wallet has $0 in it', ephemeral: true });
 
        if (value > 0) {
            const positiveChoices = [
                "You stole",
                "The owner saw you and helped you rob",
                "You robbed",
                "You took",
            ]
 
            const posName = Math.floor(Math.random() * positiveChoices.length);
 
            const begEmbed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle('Robbery Success')
            .setAuthor({ name: `🟡 Economy System`})
            .addFields({ name: '> You robbed and', value: `• ${positiveChoices[[posName]]} $${value}`})
            .setFooter({ text: `🟡 Robbery System` })
            .setThumbnail(`https://cdn.discordapp.com/attachments/1096453712236511264/1120824472014966905/robber-steals-money-criminal-steals-gold-coins-robbery-finance-security-concept-flat-style-vector_174639-19534.png`)
            .setTimestamp()
 
            await interaction.reply({ embeds: [begEmbed] })
 
            Data.Wallet += value;
            await Data.save();
 
            DataUser.Wallet -= value;
            await DataUser.save()
        } else if (value < 0) {
            const negativeChoices = [
                "You got caught by the cops and lost",
                "You left your ID and got arrested, you lost",
                "The person knocked you out and took",
            ]
 
            const wal = Data.Wallet;
            if (isNaN(value)) return await interaction.reply({ content: 'This user called the cops on you, but you ran away. You didn\'t lose or gain anything', ephemeral: true });
 
            const negName = Math.floor(Math.random() * negativeChoices.length);
 
            let nonSymbol;
            if (value - wal < 0) {
                const stringV = `${value}`;
 
                nonSymbol = await stringV.slice(1);
 
                const los = new EmbedBuilder()
                .setColor("Yellow")
                .setTitle('Robbery Failed')
                .setAuthor({ name: `🟡 Economy System`})
                .addFields({ name: '> You robbed and', value: `• ${negativeChoices[[negName]]} $${nonSymbol}`})
                .setFooter({ text: `🟡 Robbery System` })
                .setThumbnail(`https://cdn.discordapp.com/attachments/1096453712236511264/1120824472014966905/robber-steals-money-criminal-steals-gold-coins-robbery-finance-security-concept-flat-style-vector_174639-19534.png`)
                .setTimestamp()
 
                Data.Bank += value;
                await Data.save();
 
                DataUser.Wallet -= value;
                await DataUser.save();
 
                return interaction.reply({ embeds: [los] })
 
            }
 
            const begLostEmbed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle('Robbery Success')
            .setAuthor({ name: `🟡 Economy System`})
            .addFields({ name: '> You robbed and', value: `• ${negativeChoices[[negName]]} $${value}`})
            .setFooter({ text: `🟡 Robbery System` })
            .setThumbnail(`https://cdn.discordapp.com/attachments/1096453712236511264/1120824472014966905/robber-steals-money-criminal-steals-gold-coins-robbery-finance-security-concept-flat-style-vector_174639-19534.png`)
            .setTimestamp()
 
            await interaction.reply({ embeds: [begLostEmbed] })
 
            Data.Wallet += value;
            await Data.save();
 
            DataUser.Wallet -= value;
            await DataUser.save()
        }
 
        timeout.push(interaction.user.id);
        setTimeout(() => {
            timeout.shift()
        }, 30000)
    }
}