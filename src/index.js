const { 
    Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, Partials, ActivityType, Activity, AuditLogEvent, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType, AttachmentBuilder, ModalBuilder, TextInputBuilder, TextInputStyle,
    } = require(`discord.js`);

const fs = require('fs');
require('./functions/processHandlers')()
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
            { type: 'Playing', name: 'help me'},
            { type: 'Playing', name: '...'}
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
    client.login(process.env.token)
})();

