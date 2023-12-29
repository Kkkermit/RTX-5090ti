const { EmbedBuilder } = require('discord.js');
const welcomeSchema = require('../Schemas/welcome');
const config = require('../config.json');
const ServerName = config.serverName

const welcomeMessages = [
    `Welcome to the server`,
    `Hey there, welcome`,
    `Howdy, glad you're here`,
]

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const guildId = member.guild.id;

        welcomeSchema.findOne({ Guild: guildId }, (err, data) => {
            if (data) {
                const channelId = data.Channel;
                const channel = member.guild.channels.cache.get(channelId);

                if (channel) {
                    const memberUsername = member.user.username;
                    const memberThumbnail = member.user.displayAvatarURL({ size: 256 });

                    const randomMessageIndex = Math.floor(Math.random() * welcomeMessages.length);
                    const randomMessage = welcomeMessages[randomMessageIndex];

                    const userEmbed = new EmbedBuilder()
                        .setTitle(`${memberUsername}`)
                        .setDescription(`${randomMessage}\n\n» | Enjoy your stay and say Hi to everyone in https://discord.com/channels/1189332251809431572/1189332252673454172 `)
                        .setImage(memberThumbnail)
                        .setTimestamp()
                        .setFooter({ text: `Welcome to ${ServerName}`})

                    channel.send({
                        embeds: [userEmbed]
                    });
                }
            }
        });
    },
};