const { 
    Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, Partials, ActivityType, Activity, AuditLogEvent, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType, AttachmentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle,
    } = require(`discord.js`);

// Dependancies //

const fs = require('fs');
const config = require('./config.json')
const pfp = require('./pfp.json')
const ServerName = config.serverName
const Owner = config.owner
const BotName = config.botName
require('./functions/processHandlers')()
const Logs = require('discord-logs')
const { CaptchaGenerator } = require('captcha-canvas');
const Canvas = require(`canvas`);
const process = require('process');
const GiveawaysManager = require("./utils/giveaway");
const {DisTube} = require("distube")
const {SpotifyPlugin} = require("@distube/spotify")

// Define GatewayIntentBits and Partials //

const client = new Client({ intents: [
    GatewayIntentBits.Guilds, 
	GatewayIntentBits.GuildMessages, 
	GatewayIntentBits.MessageContent, 
	GatewayIntentBits.GuildMembers, 
	GatewayIntentBits.GuildPresences, 
	GatewayIntentBits.GuildIntegrations, 
	GatewayIntentBits.GuildWebhooks, 
    GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.MessageContent, 
	GatewayIntentBits.GuildEmojisAndStickers, 
	GatewayIntentBits.DirectMessages, 
	GatewayIntentBits.DirectMessageTyping, 
	GatewayIntentBits.GuildModeration, 
	GatewayIntentBits.GuildVoiceStates,
	GatewayIntentBits.GuildWebhooks, 
	GatewayIntentBits.AutoModerationConfiguration,
	GatewayIntentBits.GuildScheduledEvents, 
	GatewayIntentBits.GuildMessageTyping, 
	GatewayIntentBits.AutoModerationExecution, 
],  

partials: [
    Partials.GuildMember, 
    Partials.Channel,
    Partials.GuildScheduledEvent, 
    Partials.Message,
    Partials.Reaction, 
    Partials.ThreadMember, 
    Partials.User
]

}); 

// Rotating Status //

client.on("ready", async (client) => {
 
    setInterval(() => {

        let activities = [
            { type: 'Playing', name: 'in the darkness.'},
            { type: 'Playing', name: `with my ${client.commands.size} commands.`},
            { type: 'Watching', name: `over ${ServerName} server!`},
            { type: 'Watching', name: `${client.guilds.cache.reduce((a,b) => a+b.memberCount, 0)} members!`},
            { type: 'Playing', name: `PC building simulator`}
        ];

        const status = activities[Math.floor(Math.random() * activities.length)];

        if (status.type === 'Watching') {
            client.user.setPresence({ activities: [{ name: `${status.name}`, type: ActivityType.Watching }]});
        } else {
            client.user.setPresence({ activities: [{ name: `${status.name}`, type: ActivityType.Playing }]});
        } 
    }, 5000);
}) 

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token).then(() => {
        handleLogs(client);
    });
})();

// Status //

client.on("ready", () => {
    console.log('Bot is online.');

    client.user.setStatus("dnd");

})

// Define Schemas //

const birthdayschema = require("./Schemas/birthday");
const birthdaysetups = require('./Schemas/birthdaySetup');
const levelSchema = require('./Schemas/level');
const levelschema = require('./Schemas/levelSetup');
const botschema = require('./Schemas/botvc');
const voiceschema = require('./Schemas/membervc');
const { handleLogs } = require("./events/handleLogs");
const stickyschema = require('./Schemas/sticky');
const sticky = require('./commands/Moderation/sticky');
const capschema = require('./Schemas/verify');
const verifyusers = require('./Schemas/verifyUsers');
const roleSchema = require("./Schemas/autoRoleSchema");

// Birthday System //

setInterval(async () => {
 
    const birthdays = await birthdayschema.find();
    if(!birthdays) return;
    else {
        birthdays.forEach(async birthday => {
 
            let data = await birthdaysetups.findOne({ Guild: birthday.Guild });
            if (!data) return;
 
            if (birthday.HasRoleSince + 86400000 < Date.now() && birthday.HasRoleSince !== 0 && birthday.HasRoleSince) {
 
                let guild = await client.guilds.cache.get(birthday.Guild);
                if (!guild) await birthday.delete()
                else {
 
                    let member = await guild.members.cache.get(birthday.User);
                    if (member) {
 
                        let birthdayrole = await guild.roles.cache.get(data.Role)
 
                        if (birthdayrole) {
                            try {
                                member.roles.remove(birthdayrole);
                            } catch {}
                        }
 
                    }
 
                    await birthdayschema.updateMany({ User: birthday.User, Guild: birthday.Guild }, { $set: { HasRoleSince: 0 }});
 
                }
            }
 
            if (birthday.Time > Date.now()) return;
 
            const channel = await client.channels.cache.get(data.Channel);
            if (!channel) return await birthdayschema.updateMany({ Guild: birthday.Guild, User: user.id, }, { $set: { Time: birthday.Time + 31556926000 }});
 
            const user = await client.users.fetch(birthday.User);
 
            const embed = new EmbedBuilder()
            .setColor("#ecb6d3")
            .setThumbnail(`${pfp}`)
            .setAuthor({ name: `🎉 Birthday System`})
            .setFooter({ text: `🎉 ${user.username || 'Unknown'}'s Birthday`})
            .setTimestamp()
            .setTitle('> Birthday!')
            .addFields({ name: `• Wooo!`, value: `> It is ${user}'s birthday, wish them \n> a happy birthday!`})
 
            try {
                channel.send({ embeds: [embed] })
            } catch {}
 
            await birthdayschema.updateMany({ Guild: birthday.Guild, User: user.id, }, { $set: { Time: birthday.Time + 31556926000 }});
 
            let guild = await client.guilds.cache.get(birthday.Guild);
            if (!guild) return birthday.delete();
            else {
 
                let member = await guild.members.cache.get(birthday.User);
                if (member) {
 
                    let birthdayrole = await guild.roles.cache.get(data.Role)
 
                    if (birthdayrole) {
                        try {
                            member.roles.add(birthdayrole);
                        } catch {}
                    }
 
                }
 
                await birthdayschema.updateMany({ User: birthday.User, Guild: birthday.Guild }, { $set: { HasRoleSince: Date.now() }});
 
            }
 
        })
    }
}, 1000 * 10);

// Levelling System //

client.on(Events.MessageCreate, async (message, err) => {

    const { guild, author } = message;
    if (message.guild === null) return;
    const leveldata = await levelschema.findOne({ Guild: message.guild.id });

    if (!leveldata || leveldata.Disabled === 'disabled') return;
    let multiplier = 1;
    
    multiplier = Math.floor(leveldata.Multi);
    

    if (!guild || author.bot) return;

    levelSchema.findOne({ Guild: guild.id, User: author.id}, async (err, data) => {

        if (err) throw err;

        if (!data) {
            levelSchema.create({
                Guild: guild.id,
                User: author.id,
                XP: 0,
                Level: 0
            })
        }
    })

    const channel = message.channel;

    const give = 1;

    const data = await levelSchema.findOne({ Guild: guild.id, User: author.id});

    if (!data) return;

    const requiredXP = data.Level * data.Level * 20 + 20;

    if (data.XP + give >= requiredXP) {

        data.XP += give;
        data.Level += 1;
        await data.save();
        
        if (!channel) return;

        const levelembed = new EmbedBuilder()
        .setColor("Purple")
        .setTitle(`> ${author.username} has Leveled Up!`)
        .setFooter({ text: `⬆️ ${author.username} Leveled Up`})
        .setTimestamp()
        .setThumbnail(`${pfp}`)
        .addFields({ name: `• New Level Unlocked`, value: `> ${author.username} is now level **${data.Level}**!`})
        .setAuthor({ name: `⬆️ Level Playground`})

        await message.channel.send({ embeds: [levelembed] }).catch(err => console.log('Error sending level up message!'));
    } else {

        if(message.member.roles.cache.find(r => r.id === leveldata.Role)) {
            data.XP += give * multiplier;
        } data.XP += give;
        data.save();
    }
})

// Total Bots Voice Channel Code //

client.on(Events.GuildMemberAdd, async (member, err) => {

    if (member.guild === null) return;
    const botdata = await botschema.findOne({ Guild: member.guild.id });

    if (!botdata) return;
    else {

        const botvoicechannel = member.guild.channels.cache.get(botdata.BotChannel);
        if (!botvoicechannel || botvoicechannel === null) return;
        const botslist = member.guild.members.cache.filter(member => member.user.bot).size;

        botvoicechannel.setName(`• Total Bots: ${botslist}`).catch(err);

    }
})

client.on(Events.GuildMemberRemove, async (member, err) => {

    if (member.guild === null) return;
    const botdata1 = await botschema.findOne({ Guild: member.guild.id });

    if (!botdata1) return;
    else {

        const botvoicechannel1 = member.guild.channels.cache.get(botdata1.BotChannel);
        if (!botvoicechannel1 || botvoicechannel1 === null) return;
        const botslist1 = member.guild.members.cache.filter(member => member.user.bot).size;

        botvoicechannel1.setName(`• Total Bots: ${botslist1}`).catch(err);
    
    }
})

// Member Voice Channels Code //

client.on(Events.GuildMemberAdd, async (member, err) => {

    if (member.guild === null) return;
    const voicedata = await voiceschema.findOne({ Guild: member.guild.id });

    if (!voicedata) return;
    else {

        const totalvoicechannel = member.guild.channels.cache.get(voicedata.TotalChannel);
        if (!totalvoicechannel || totalvoicechannel === null) return;
        const totalmembers = member.guild.memberCount;

        totalvoicechannel.setName(`• Total Members: ${totalmembers}`).catch(err);

    }
})

client.on(Events.GuildMemberRemove, async (member, err) => {

    if (member.guild === null) return;
    const voicedata1 = await voiceschema.findOne({ Guild: member.guild.id });

    if (!voicedata1) return;
    else {

        const totalvoicechannel1 = member.guild.channels.cache.get(voicedata1.TotalChannel);
        if (!totalvoicechannel1 || totalvoicechannel1 === null) return;
        const totalmembers1 = member.guild.memberCount;

        totalvoicechannel1.setName(`• Total Members: ${totalmembers1}`).catch(err);
    }
})

// Modlogs

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});
 
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception:", err);
});
 
Logs(client, {
    debug: true
})

// Sticky Message //

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;

    stickyschema.findOne({ ChannelID: message.channel.id}, async (err, data) => {
        if (err) throw err;

        if (!data) {
            return;
        }

        let stickychannel = data.ChannelID;
        let cachedChannel = client.channels.cache.get(stickychannel);
        
        const embed = new EmbedBuilder()
        .setThumbnail(`${pfp}`)
        .setTitle('> Sticky Note')
        .setAuthor({ name: '📝 Sticky Message Tool'})
        .setFooter({ text: `📝 Sticky Message Created | Designed By ${Owner}`})
        .addFields({ name: '• Sticky Content', value: `> ${data.Message}`})
        .setColor("DarkBlue")
        .setTimestamp()

        if (message.channel.id == (stickychannel)) {

            data.CurrentCount += 1;
            data.save();

            if (data.CurrentCount > data.MaxCount) {
                try {
                    await client.channels.cache.get(stickychannel).messages.fetch(data.LastMessageID).then(async(m) => {
                        await m.delete();
                    })

                    let newMessage = await cachedChannel.send({ embeds: [embed]})

                    data.LastMessageID = newMessage.id;
                    data.CurrentCount = 0;
                    data.save();
                } catch {
                    return;
                }
            }
        }
    })
})

// VERIFICATION CAPTCHA SYSTEM CODE //

client.on(Events.InteractionCreate, async interaction => {

    if (interaction.guild === null) return;

    const verifydata = await capschema.findOne({ Guild: interaction.guild.id });
    const verifyusersdata = await verifyusers.findOne({ Guild: interaction.guild.id, User: interaction.user.id });

    if (interaction.customId === 'verify') {

        if (!verifydata) return await interaction.reply({ content: `The **verification system** has been disabled in this server!`, ephemeral: true});

        if (verifydata.Verified.includes(interaction.user.id)) return await interaction.reply({ content: 'You have **already** been verified!', ephemeral: true})
        else {

            let letter = ['0','1','2','3','4','5','6','7','8','9','a','A','b','B','c','C','d','D','e','E','f','F','g','G','h','H','i','I','j','J','f','F','l','L','m','M','n','N','o','O','p','P','q','Q','r','R','s','S','t','T','u','U','v','V','w','W','x','X','y','Y','z','Z',]
            let result = Math.floor(Math.random() * letter.length);
            let result2 = Math.floor(Math.random() * letter.length);
            let result3 = Math.floor(Math.random() * letter.length);
            let result4 = Math.floor(Math.random() * letter.length);
            let result5 = Math.floor(Math.random() * letter.length);

            const cap = letter[result] + letter[result2] + letter[result3] + letter[result4] + letter[result5];
            console.log(cap)

            const captcha = new CaptchaGenerator()
            .setDimension(150, 450)
            .setCaptcha({ text: `${cap}`, size: 60, color: "green"})
            .setDecoy({ opacity: 0.5 })
            .setTrace({ color: "green" })

            const buffer = captcha.generateSync();
            
            const verifyattachment = new AttachmentBuilder(buffer, { name: `captcha.png`});
            
            const verifyembed = new EmbedBuilder()
            .setColor('Green')
            .setAuthor({ name: `✅ Verification Proccess`})
            .setFooter({ text: `✅ Verification Captcha`})
            .setTimestamp()
            .setImage('attachment://captcha.png')
            .setThumbnail(`${pfp}`)
            .setTitle('> Verification Step: Captcha')
            .addFields({ name: `• Verify`, value: '> Please use the button bellow to \n> submit your captcha!'})

            const verifybutton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel('✅ Enter Captcha')
                .setStyle(ButtonStyle.Success)
                .setCustomId('captchaenter')
            )

            const vermodal = new ModalBuilder()
            .setTitle('Verification')
            .setCustomId('vermodal')

            const answer = new TextInputBuilder()
            .setCustomId('answer')
            .setRequired(true)
            .setLabel('• Please sumbit your Captcha code')
            .setPlaceholder('Your captcha code')
            .setStyle(TextInputStyle.Short)

            const vermodalrow = new ActionRowBuilder().addComponents(answer);
            vermodal.addComponents(vermodalrow);

            try {
                const vermsg = await interaction.reply({ embeds: [verifyembed], components: [verifybutton], ephemeral: true, files: [verifyattachment] });

                const vercollector = vermsg.createMessageComponentCollector();

                vercollector.on('collect', async i => {

                    if (i.customId === 'captchaenter') {
                        i.showModal(vermodal);
                    }

                })

            } catch (err) {
                return;
            }

            if (verifyusersdata) {

                await verifyusers.deleteMany({
                    Guild: interaction.guild.id,
                    User: interaction.user.id
                })

                await verifyusers.create ({
                    Guild: interaction.guild.id,
                    User: interaction.user.id,
                    Key: cap
                })

            } else {

                await verifyusers.create ({
                    Guild: interaction.guild.id,
                    User: interaction.user.id,
                    Key: cap
                })

            }
        } 
    }
})

client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'vermodal') {

        const userverdata = await verifyusers.findOne({ Guild: interaction.guild.id, User: interaction.user.id });
        const verificationdata = await capschema.findOne({ Guild: interaction.guild.id });

        if (verificationdata.Verified.includes(interaction.user.id)) return await interaction.reply({ content: `You are **already** verified within this server!`, ephemeral: true});
        
        const modalanswer = interaction.fields.getTextInputValue('answer');
        if (modalanswer === userverdata.Key) {

            const verrole = await interaction.guild.roles.cache.get(verificationdata.Role);

            try {
                await interaction.member.roles.add(verrole);
            } catch (err) {
                return await interaction.reply({ content: `There was an **issue** giving you the **<@&${verificationdata.Role}>** role, try again later!`, ephemeral: true})
            }


            await capschema.updateOne({ Guild: interaction.guild.id }, { $push: { Verified: interaction.user.id }});

            try {
                await interaction.reply({ content: 'You have been **verified!**', ephemeral: true});
            } catch (err) {
                return;
            }

        } else {
            await interaction.reply({ content: `**Oops!** It looks like you **didn't** enter the valid **captcha code**!`, ephemeral: true})
        }
    }
})

client.on(Events.GuildMemberRemove, async member => {
    try {
        await capschema.updateOne({ Guild: member.guild.id }, { $pull: { Verified: member.id }});
    } catch (err) {
        console.log(`Couldn't delete verify data`)
    }
})

// Advanced Help Menu //

client.on(Events.InteractionCreate, async (interaction, err) => {

    const helprow2 = new ActionRowBuilder()
        .addComponents(

            new StringSelectMenuBuilder()
            .setMinValues(1)
            .setMaxValues(1)
            .setCustomId('selecthelp')
            .setPlaceholder('• Select a menu')
            .addOptions(
                {
                    label: '• Help Center',
                    description: 'Navigate to the Help Center.',
                    value: 'helpcenter',
                },

                {
                    label: '• How to add the bot',
                    description: `Displays how to add ${BotName} to your amazing server.`,
                    value: 'howtoaddbot'
                },

                {
                    label: '• Feedback',
                    description: `Displays how to contribute to the devlopment of ${BotName} by giving feedback.`,
                    value: 'feedback'
                },

                {
                    label: '• Commands Help',
                    description: 'Navigate to the Commands help page.',
                    value: 'commands',
                },
            ),
        );

    if (!interaction.isStringSelectMenu()) return;
    if (interaction.customId === 'selecthelp') {
        let choices = "";

        const centerembed = new EmbedBuilder()
        .setColor("DarkOrange")
        .setTitle('> Get Help')
        .setAuthor({ name: `🚑 Help Command`})
        .setFooter({ text: `🚑 Help command: Help Center`})
        .setThumbnail(`${pfp}`)
        .addFields({ name: "• Commands Help", value: `> Get all **Commands** (**${client.commands.size}**) purposes.`})
        .addFields({ name: "• How to add Bot", value: "> Quick guide on how to your own custom bot to your server."})
        .addFields({ name: "• Feedback", value: "> How to send us feedback and suggestions."})
        .setTimestamp()

        interaction.values.forEach(async (value) => {
            choices += `${value}`;

            if (value === 'helpcenter') {

                setTimeout(() => {
                    interaction.update({ embeds: [centerembed] }).catch(err);
                }, 100)

            }

            if (value === 'howtoaddbot') {

                setTimeout(() => {
                    const howtoaddembed = new EmbedBuilder()
                    .setColor("DarkOrange")
                    .setTitle('> How to add our Bot')
                    .setAuthor({ name: `🚑 Help Command` })
                    .setFooter({ text: `🚑 Help command: How To Add Bot` })
                    .setThumbnail(`${pfp}`)
                    .addFields({ name: "• How to add one of our bots to your server", value: `> To add your own custom bot to your server, message ${Owner} on Discord.`})
                    .addFields({ name: "• Wait.. what Official Discord server..", value: "> This is our Discord server: https://discord.gg/xcMVwAVjSD" })
                    .addFields({ name: "• Our official website..", value: "> This is our official website: https://orbit-exe.xyz/ "})
                    .setTimestamp();

                    interaction.update({ embeds: [howtoaddembed] }).catch(err);
                }, 100)
            }

            if (value === 'feedback') {

                setTimeout(() => {
                    const feedbackembed = new EmbedBuilder()
                    .setColor("DarkOrange")
                    .setTitle('> How to give us Feedback')
                    .setAuthor({ name: `🚑 Help Command` })
                    .setFooter({ text: `🚑 Help command: Feedback` })
                    .setThumbnail(`${pfp}`)
                    .addFields({ name: "• How can I give Feedback?", value: `> The creator of ${BotName} appreciates your opinion on our the bot. To send feedback or suggestions, use the commands below.` })
                    .addFields({ name: "• /feedback", value: "> Opens up a feedback form" })
                    .addFields({ name: "• /suggestion", value: "> Opens up a suggestion form" })
                    .setTimestamp();

                    interaction.update({ embeds: [feedbackembed] }).catch(err);
                }, 100)
            }

            if (value === 'commands') {

                const commandpage1 = new EmbedBuilder()
                    .setColor("DarkOrange")
                    .setTitle('> Commands Help')
                    .setAuthor({ name: `🚑 Help Command` })
                    .setFooter({ text: `🚑 Help command: Commands Page 1 - **Community Commands**` })
                    .setThumbnail(`${pfp}`)
                    .addFields({ name: "• /advice", value: "> Gives the user some top notch advice." })
                    .addFields({ name: "• /animal-fact", value: "> Shows you a fact about an animal." })
                    .addFields({ name: "• /avatar", value: "> grabs a users avatar." })
                    .addFields({ name: "• /calculator", value: "> Displays a working calculator." })
                    .addFields({ name: "• /date", value: "> Displays the date and time." })
                    .addFields({ name: "• /dictionary", value: "> Input a word to get a dictionary meaning." })
                    .addFields({ name: "• /fake-tweet", value: "> Displays a fake tweet from a given user." })
                    .addFields({ name: "• /hack", value: "> Hacks a given user, (Not real!)" })
                    .addFields({ name: "• /help-server", value: "> Displays the bots help server." })
                    .addFields({ name: "• /help-manual", value: "> Displays a dynamic help menu." })
                    .addFields({ name: "• /image-generate", value: "> Generates an AI image." })
                    .addFields({ name: "• /impersonate", value: "> Impersonates a given user." })
                    .addFields({ name: "• /kanye-quote", value: "> Shows the quotes from Kanye West." })
                    .addFields({ name: "• /khaled-quotes", value: "> Shows the quotes from DJ Khalid." })
                    .addFields({ name: "• /latency", value: "> Displays the clients latency." })
                    .addFields({ name: "• /lyrics", value: "> Shows the lyrics of a given song." })
                    .addFields({ name: "• /mc-skin", value: "> Shows a users Minecraft skin." })
                    .addFields({ name: "• /meme", value: "> Shows the memes from r/memes server." })
                    .addFields({ name: "• /nitro", value: "> Generates fake nitro links." })
                    .addFields({ name: "• /random-game", value: "> Shows random games from a given category." })
                    .addFields({ name: "• /soundboard", value: "> Soundboard with sound effects." })
                    .addFields({ name: "• /suggestion", value: `> Use to give ${Owner} a suggestion about the ${BotName}.` })
                    .addFields({ name: "• /tts", value: "> Sends a tts message." })
                    .addFields({ name: "• /wiki", value: "> Gives the given input as a wiki search." })
                    .addFields({ name: "• /radio", value: "> Listen to given radio station." })
                    .setImage('https://cdn.discordapp.com/attachments/1080219392337522718/1081867062177181736/Screenshot_300.png')
                    .setTimestamp();

                const commandpage2 = new EmbedBuilder()
                    .setColor("DarkOrange")
                    .setTitle('> Commands Help')
                    .setAuthor({ name: `🚑 Help Command` })
                    .setFooter({ text: `🚑 Help command: Commands Page 2 - **Moderation Commands**` })
                    .setThumbnail(`${pfp}`)
                    .addFields({ name: "• /add-sticker", value: "> Adds a given sticker to the server." })
                    .addFields({ name: "• /announce", value: "> Sends an announcement to a given channel." })
                    .addFields({ name: "• /autorole add", value: "> Adds the auto role feature." })
                    .addFields({ name: "• /autorole remove", value: "> Removes the auto role feature." })
                    .addFields({ name: "• /autorole disable", value: "> Disables the auto role system all together." })
                    .addFields({ name: "• /autorole list", value: "> List the current roles in auto role." })
                    .addFields({ name: "• /ban", value: "> Bans a given user." })
                    .addFields({ name: "• /birthday setup", value: "> Sets up the birthday system." })
                    .addFields({ name: "• /birthday disable", value: "> Disables the birthday system." })
                    .addFields({ name: "• /birthday set", value: "> Sets a users birthday announcement." })
                    .addFields({ name: "• /birthday remove", value: "> Removes a users birthday announcement." })
                    .addFields({ name: "• /clear", value: "> Clears a given amount of messages." })
                    .addFields({ name: "• /create embed", value: "> Creates an embed." })
                    .addFields({ name: "• /create thread", value: "> Creates a thread." })
                    .addFields({ name: "• /kick", value: "> Kicks a given user." })
                    .addFields({ name: "• /logs setup", value: "> Sets up the mod logs feature." })
                    .addFields({ name: "• /logs disable", value: "> Disables the mod logs feature." })
                    .addFields({ name: "• /mod-panel", value: "> Displays a mod panel on a user." })
                    .addFields({ name: "• /mute", value: "> Mutes a given user." })
                    .addFields({ name: "• /say", value: "> Makes the bot say something." })
                    .addFields({ name: "• /steal", value: "> Steals a servers emoji." })
                    .addFields({ name: "• /sticky set", value: "> Sets up the sticky feature." })
                    .addFields({ name: "• /sticky remove", value: "> Disables the sticky feature." })
                    .addFields({ name: "• /unban", value: "> Unbans a given user." })
                    .setImage('https://cdn.discordapp.com/attachments/1080219392337522718/1081867062177181736/Screenshot_300.png')
                    .setTimestamp();

                const commandpage3 = new EmbedBuilder()
                    .setColor("DarkOrange")
                    .setTitle('> Commands Help')
                    .setAuthor({ name: `🚑 Help Command` })
                    .setFooter({ text: `🚑 Help command: Commands Page 3 - **Moderation Commands Continued...**` })
                    .setThumbnail(`${pfp}`)
                    .addFields({ name: "• /members-vc total-set", value: "> Turns a VC into a counter of amount of server members." })
                    .addFields({ name: "• /members-vc total-remove", value: "> Removes the VC count feature for server members." })
                    .addFields({ name: "• /members-vc bot-set", value: "> Turns a VC into a counter of the amount of server bots." })
                    .addFields({ name: "• /members-vc bot-remove", value: "> Removes the VC count for the amount of server bots." })
                    .addFields({ name: "• /welcome-setup", value: "> Sets up the welcome channel for the server." })
                    .addFields({ name: "• /welcome-disable", value: "> Disables the welcome channel for the server." })
                    .addFields({ name: "• /giveaway start", value: "> Starts the giveaway." })
                    .addFields({ name: "• /giveaway edit", value: "> Edits the current giveaway." })
                    .addFields({ name: "• /giveaway end", value: "> Ends the current giveaway." })
                    .addFields({ name: "• /warn", value: "> Warns a given user." })
                    .addFields({ name: "• /clear warnings", value: "> Clears the warnings of a given user." })
                    .addFields({ name: "• /verify setup", value: "> Sets up the verification system." })
                    .addFields({ name: "• /verify disable", value: "> Disables the verification system." })
                    .addFields({ name: "• /verify bypass", value: "> Bypasses the verification process." })
                    .addFields({ name: "• /verify remove", value: "> Removes the verification message." })
                    .addFields({ name: "• /automod flagged words", value: "> Blocks profanity from being sent." })
                    .addFields({ name: "• /automod keyword", value: "> Blocks a specified word on the server." })
                    .addFields({ name: "• /automod mention-spam", value: "> Stops users from spam pinging." })
                    .addFields({ name: "• /automod spam-messages", value: "> Stops spam from being sent." })
                    .addFields({ name: "• /give xp", value: "> Gives a user XP." })
                    .addFields({ name: "• /gives currency", value: "> Gives a user currency." })
                    .addFields({ name: "• /reset all-xp", value: "> Resets all the XP." })
                    .addFields({ name: "• /reset all currency", value: "> Resets all the currency." })
                    .addFields({ name: "• /reset currency", value: "> Resets a users currency." })
                    .addFields({ name: "• /reset xp", value: "> Resets a users XP."})
                    .setImage('https://cdn.discordapp.com/attachments/1080219392337522718/1081867062177181736/Screenshot_300.png')
                    .setTimestamp();

                const commandpage4 = new EmbedBuilder()
                    .setColor("DarkOrange")
                    .setTitle('> Commands Help')
                    .setAuthor({ name: `🚑 Help Command` })
                    .setFooter({ text: `🚑 Help command: Commands Page 4 - **Info Commands & Minigames**` })
                    .addFields({ name: "• /bot stats", value: "> Displays the bots stats." })
                    .addFields({ name: "• /bot specs", value: "> Displays the bots specs." })
                    .addFields({ name: "• /bot ping", value: "> Displays the bots ping." })
                    .addFields({ name: "• /bot online", value: "> Displays whether the bots online." })
                    .addFields({ name: "• /movie-tracker", value: "> Shows info of a given movie." })
                    .addFields({ name: "• /permissions", value: "> Shows the permissions of a given user." })
                    .addFields({ name: "• /role-info", value: "> Displays the info a given role." })
                    .addFields({ name: "• /server-info", value: "> Displays advanced server information." })
                    .addFields({ name: "• /who-is", value: "> Displays info about a given user." })
                    .addFields({ name: "• /ascii", value: "> Creates an ascii table from a given word." })
                    .addFields({ name: "• /coin-flip", value: "> Flips a coin." })
                    .addFields({ name: "• /interaction hug", value: "> Hugs a given user." })
                    .addFields({ name: "• /interaction slap", value: "> Slaps a given user." })
                    .addFields({ name: "• /interaction kill", value: "> Kills a given user." })
                    .addFields({ name: "• /interaction kiss", value: "> Kisses a given user." })
                    .addFields({ name: "• /interaction yell", value: "> Yells at a given user." })
                    .addFields({ name: "• /minigame 8ball", value: "> Displays the 8ball game." })
                    .addFields({ name: "• /minigame 2048", value: "> Displays the 2048 game." })
                    .addFields({ name: "• /minigame minesweeper", value: "> Displays the minesweeper game." })
                    .addFields({ name: "• /minigame snake", value: "> Displays the snake game." })
                    .addFields({ name: "• /minigame hangman", value: "> Displays the hangman game." })
                    .addFields({ name: "• /minigame tic-tac-toe", value: "> Displays the tic tac toe game." })
                    .addFields({ name: "• /minigame wordle", value: "> Displays the wordle game." })
                    .addFields({ name: "• /minigame would-you-rather", value: "> Displays the would you rather game." })
                    .addFields({ name: "• /oogway", value: "> Creates a master oogway quote." })
                    .setThumbnail(`${pfp}`)
                    .setImage('https://cdn.discordapp.com/attachments/1080219392337522718/1081867062177181736/Screenshot_300.png')
                    .setTimestamp();

                    const commandpage5 = new EmbedBuilder()
                    .setColor("DarkOrange")
                    .setTitle('> Commands Help')
                    .setAuthor({ name: `🚑 Help Command` })
                    .addFields({ name: "• /my-iq", value: "Displays a given users IQ."})
                    .addFields({ name: "• /pp-size", value: "> Displays the users PP size." })
                    .addFields({ name: "• /rate gay", value: "> Displays how gay a user is." })
                    .addFields({ name: "• /rate sus", value: "> Displays how sus a user is." })
                    .addFields({ name: "• /rate stupid", value: "> Displays how stupid a user is." })
                    .addFields({ name: "• /rock-paper-scissors", value: "> Displays the rock paper scissors minigame." })
                    .addFields({ name: "• /leaderboard", value: "> Displays the levelling system leaderboard." })
                    .addFields({ name: "• /leveling role-multiplier", value: "> Enables the xp role multiplier." })
                    .addFields({ name: "• /leveling disable", value: "> Disable the leveling system." })
                    .addFields({ name: "• /leveling enable", value: "> Enables the leveling system." })
                    .addFields({ name: "• /leveling disable-multiplier", value: "> Disables the role multiplier." })
                    .addFields({ name: "• /xp-reset", value: "> Resets all the servers XP." })
                    .addFields({ name: "• /rank", value: "> Displays a users current rank." })
                    .addFields({ name: "• /invite", value: "> Displays a given users amount of invites." })
                    .addFields({ name: "• /poll", value: "> Creates a poll." })
                    .addFields({ name: `• @${BotName}`, value: "> Displays some info about the bot." })

                    .setFooter({ text: `🚑 Help command: Commands Page 5 - **Minigame & Level Commands**` })
                    .setThumbnail(`${pfp}`)
                    .setImage('https://cdn.discordapp.com/attachments/1080219392337522718/1081867062177181736/Screenshot_300.png')
                    .setTimestamp();

                    const commandpage6 = new EmbedBuilder()
                    .setColor("DarkOrange")
                    .setTitle('> Commands Help')
                    .setAuthor({ name: `🚑 Help Command` })
                    .setFooter({ text: `🚑 Help command: Commands Page 6 - **Music Commands**` })
                    .addFields({ name: "• /music play", value: "> Plays a given song."})
                    .addFields({ name: "• /music volume", value: "> Changes the music volume."})
                    .addFields({ name: "• /music options queue", value: "> Loads the queue."})
                    .addFields({ name: "• /music options skip", value: "> Skip the current song in the queue."})
                    .addFields({ name: "• /music options pause", value: "> Pauses the current song."})
                    .addFields({ name: "• /music options resume", value: "> Resumes the current song."})
                    .addFields({ name: "• /music options stop", value: "> Stops the current song from playing."})
        
                    .setThumbnail(`${pfp}`)
                    .setImage('https://cdn.discordapp.com/attachments/1080219392337522718/1081867062177181736/Screenshot_300.png')
                    .setTimestamp();

                    const commandpage7 = new EmbedBuilder()
                    .setColor("DarkOrange")
                    .setTitle('> Commands Help')
                    .setAuthor({ name: `🚑 Help Command` })
                    .setFooter({ text: `🚑 Help command: Commands Page 7 - **Economy Commands**` })
                    .addFields({ name: '• /bal', value: '> Shows a users balance.'})
                    .addFields({ name: '• /beg', value: '> Initiate begging sequence.'})
                    .addFields({ name: '• /daily', value: '> Gives the user a daily allownce.'})
                    .addFields({ name: '• /deposit', value: '> Deposits a users money into the bank.'})
                    .addFields({ name: '• /economy', value: '> Opens an account in the economy.'})
                    .addFields({ name: '• /withdraw', value: '> Withdraws a users money from the bank.'})
                    .addFields({ name: '• /rob', value: '> Robs another user from the money in their wallet.'})
                    .setThumbnail(`${pfp}`)
                    .setImage('https://cdn.discordapp.com/attachments/1080219392337522718/1081867062177181736/Screenshot_300.png')
                    .setTimestamp(); 

                    


                const commandbuttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('helpcenterbutton')
                            .setLabel('Help Center')
                            .setStyle(ButtonStyle.Success),

                            new ButtonBuilder()
                            .setCustomId('first')
                            .setLabel('◀◀')
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId('pageleft')
                            .setLabel('◀')
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                            .setCustomId('pageright')
                            .setLabel('▶')
                            .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                            .setCustomId('last')
                            .setLabel('▶▶')
                            .setStyle(ButtonStyle.Primary)
                    );

                const commandbuttons1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('helpcenterbutton1')
                            .setLabel('Help Center')
                            .setStyle(ButtonStyle.Success),

                            new ButtonBuilder()
                            .setCustomId('first')
                            .setLabel('◀◀')
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId('pageleft1')
                            .setLabel('◀')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                            .setCustomId('pageright1')
                            .setDisabled(false)
                            .setLabel('▶')
                            .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                            .setCustomId('last')
                            .setLabel('▶▶')
                            .setStyle(ButtonStyle.Primary)
                        );

                    const commandbuttons2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('helpcenterbutton2')
                            .setLabel('Help Center')
                            .setStyle(ButtonStyle.Success),

                            new ButtonBuilder()
                            .setCustomId('first')
                            .setLabel('◀◀')
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId('pageleft2')
                            .setLabel('◀')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                            .setCustomId('pageright2')
                            .setDisabled(false)
                            .setLabel('▶')
                            .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                            .setCustomId('last')
                            .setLabel('▶▶')
                            .setStyle(ButtonStyle.Primary)
                    );

                const commandbuttons3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('helpcenterbutton3')
                            .setLabel('Help Center')
                            .setStyle(ButtonStyle.Success),

                            new ButtonBuilder()
                            .setCustomId('first')
                            .setLabel('◀◀')
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId('pageleft3')
                            .setLabel('◀')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                            .setCustomId('pageright3')
                            .setDisabled(false)
                            .setLabel('▶')
                            .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                            .setCustomId('last')
                            .setLabel('▶▶')
                            .setStyle(ButtonStyle.Primary)
                    );

                const commandbuttons4 = new ActionRowBuilder()
                    .addComponents(

                        new ButtonBuilder()
                            .setCustomId('helpcenterbutton4')
                            .setLabel('Help Center')   
                            .setStyle(ButtonStyle.Success),

                            new ButtonBuilder()
                            .setCustomId('first')
                            .setLabel('◀◀')
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId('pageleft4')
                            .setLabel('◀')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                            .setCustomId('pageright4')
                            .setDisabled(false)
                            .setLabel('▶')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('last')
                            .setLabel('▶▶')
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Primary)
                            
                    );
                
                    const commandbuttons5 = new ActionRowBuilder()
                    .addComponents(

                        new ButtonBuilder()
                            .setCustomId('helpcenterbutton5')
                            .setLabel('Help Center')   
                            .setStyle(ButtonStyle.Success),

                            new ButtonBuilder()
                            .setCustomId('first')
                            .setLabel('◀◀')
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId('pageleft5')
                            .setLabel('◀')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                            .setCustomId('pageright5')
                            .setDisabled(false)
                            .setLabel('▶')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('last')
                            .setLabel('▶▶')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Primary)
                            
                    );

                    const commandbuttons6 = new ActionRowBuilder()
                    .addComponents(

                        new ButtonBuilder()
                            .setCustomId('helpcenterbutton6')
                            .setLabel('Help Center')   
                            .setStyle(ButtonStyle.Success),

                            new ButtonBuilder()
                            .setCustomId('first')
                            .setLabel('◀◀')
                            .setStyle(ButtonStyle.Primary),

                        new ButtonBuilder()
                            .setCustomId('pageleft6')
                            .setLabel('◀')
                            .setDisabled(false)
                            .setStyle(ButtonStyle.Secondary),

                        new ButtonBuilder()
                            .setCustomId('pageright6')
                            .setDisabled(true)
                            .setLabel('▶')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('last')
                            .setLabel('▶▶')
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Primary)
                            
                    );


                await interaction.update({ embeds: [commandpage1], components: [commandbuttons] }).catch(err);
                const collector = interaction.message.createMessageComponentCollector({ componentType: ComponentType.Button });

                collector.on('collect', async (i, err) => {

                    if (i.customId === 'last') {
                        i.update({ embeds: [commandpage7], components: [commandbuttons6] }).catch(err);
                    } 

                    if (i.customId === 'first') {
                        i.update({ embeds: [commandpage1], components: [commandbuttons] }).catch(err);
                    }

                    if (i.customId === 'helpcenterbutton') {
                        i.update({ embeds: [centerembed], components: [helprow2] }).catch(err);
                    }

                    if (i.customId === 'pageleft') { 
                        i.update({ embeds: [commandpage1], components: [commandbuttons] }).catch(err);
                    }

                    if (i.customId === 'pageright') { 
                        i.update({ embeds: [commandpage2], components: [commandbuttons1] }).catch(err);
                    }

                    if (i.customId === 'helpcenterbutton1') {
                        i.update({ embeds: [centerembed], components: [helprow2] }).catch(err);
                    }

                    if (i.customId === 'pageright1') {
                        i.update({ embeds: [commandpage3], components: [commandbuttons2] }).catch(err);
                    }

                    if (i.customId === 'pageleft1') {
                        i.update({ embeds: [commandpage1], components: [commandbuttons] }).catch(err);
                    }

                    if (i.customId === 'helpcenterbutton2') {
                        i.update({ embeds: [centerembed], components: [helprow2] }).catch(err);
                    }

                    if (i.customId === 'pageright2') {
                        i.update({ embeds: [commandpage4], components: [commandbuttons3] }).catch(err);
                    }

                    if (i.customId === 'pageleft2') {
                        i.update({ embeds: [commandpage2], components: [commandbuttons1] }).catch(err);
                    }

                    if (i.customId === 'helpcenterbutton3') {
                        i.update({ embeds: [centerembed], components: [helprow2] }).catch(err)
                    }

                    if (i.customId === 'pageright3') {
                        i.update({ embeds: [commandpage5], components: [commandbuttons4] }).catch(err);
                    }

                    if (i.customId === 'pageleft3') {
                        i.update({ embeds: [commandpage3], components: [commandbuttons2] }).catch(err);
                    }

                    if (i.customId === 'helpcenterbutton4') {
                        i.update({ embeds: [centerembed], components: [helprow2] }).catch(err);
                    }

                    if (i.customId === 'pageright4') {
                        i.update({ embeds: [commandpage6], components: [commandbuttons5] }).catch(err);
                    } 

                    if (i.customId === 'pageleft4') {
                        i.update({ embeds: [commandpage4], components: [commandbuttons3] }).catch(err);
                    }

                    if (i.customId === 'helpcenterbutton5') {
                        i.update({ embeds: [centerembed], components: [helprow2] }).catch(err);
                    }

                    if (i.customId === 'pageright5') {
                        i.update({ embeds: [commandpage7], components: [commandbuttons6] }).catch(err);
                    } 

                    if (i.customId === 'pageleft5') {
                        i.update({ embeds: [commandpage5], components: [commandbuttons4] }).catch(err);
                    }

                    if (i.customId === 'helpcenterbutton6') {
                        i.update({ embeds: [centerembed], components: [helprow2] }).catch(err);
                    }

                    if (i.customId === 'pageright6') {
                        i.update({ embeds: [commandpage7], components: [commandbuttons6] }).catch(err);
                    } 

                    if (i.customId === 'pageleft6') {
                        i.update({ embeds: [commandpage6], components: [commandbuttons5] }).catch(err);
                    } 
                });
            }
        })
    }
})

// Giveaway Manager //

client.giveawayManager = new GiveawaysManager(client, {
    default: {
      botsCanWin: false,
      embedColor: "#a200ff",
      embedColorEnd: "#550485",
      reaction: "🎉",
    },
});

// Auto Role //

client.on("guildMemberAdd", async member => {
    const { guild } = member;
  
    const data = await roleSchema.findOne({ GuildID: guild.id });
    if (!data) return;
    if (data.Roles.length < 0) return;
    for (const r of data.Roles) {
      await member.roles.add(r);
    }
  
  })

// Music System //

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true, 
    emitAddListWhenCreatingQueue: false, 
    plugins: [new SpotifyPlugin()]
});

const status = queue =>
    `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
    }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
    .on('playSong', (queue, song) =>
        queue.textChannel.send({
            embeds: [new EmbedBuilder().setColor("Green")
                .setDescription(`🎶 | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user
                    }\n${status(queue)}`)]
        })
    )
    .on('addSong', (queue, song) =>
        queue.textChannel.send(
            {
                embeds: [new EmbedBuilder().setColor("Green")
                    .setDescription(`🎶 | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`)]
            }
        )
    )
    .on('addList', (queue, playlist) =>
        queue.textChannel.send(
            {
                embeds: [new EmbedBuilder().setColor("Green")
                    .setDescription(`🎶 | Added \`${playlist.name}\` playlist (${playlist.songs.length
                        } songs) to queue\n${status(queue)}`)]
            }
        )
    )
    .on('error', (channel, e) => {
        if (channel) channel.send(`⛔ | An error encountered: ${e.toString().slice(0, 1974)}`)
        else console.error(e)
    })
    .on('empty', channel => channel.send({
        embeds: [new EmbedBuilder().setColor("Red")
            .setDescription('⛔ |Voice channel is empty! Leaving the channel...')]
    }))
    .on('searchNoResult', (message, query) =>
        message.channel.send(
            {
                embeds: [new EmbedBuilder().setColor("Red")
                    .setDescription('`⛔ | No result found for \`${query}\`!`')]
            })
    )
    .on('finish', queue => queue.textChannel.send({
        embeds: [new EmbedBuilder().setColor("Green")
            .setDescription('🏁 | Queue finished!')]
    }))