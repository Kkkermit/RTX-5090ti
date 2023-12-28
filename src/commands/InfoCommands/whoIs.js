const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription(`Get info of a member in the server.`)
    .addUserOption(option => option.setName(`user`).setDescription(`the user you want to get info from`).setRequired(false)),
    async execute (interaction, client) {

        const formatter = new Intl.ListFormat(`en-GB`, { style: `narrow`, type: `conjunction` });
        
        //Change the emojis down below
        const badges = {
            BugHunterLevel1: "<:bughunter:1189779614143365120>",
            BugHunterLevel2: "<:bughunter2:1189779791142977629>",
            HypeSquadOnlineHouse1: "<:bravery:1189779986517860382>",
            HypeSquadOnlineHouse2: "<:balance:1189780198556708924>",
            HypeSquadOnlineHouse3: "<:brilliance:1189780421983088681>",
            Hypesquad: "<:hypersquad:1189780607673303060>",
            Partner: "<:partner:1189780724115574865>",
            PremiumEarlySupporter: "<:earlysupporter:1189780883847266355>",
            Staff: "<:partner:1189781064575623178>",
            VerfiedDeveloper: "<:verifieddev:1189781284294242324>",
            ActiveDeveloper: "<:VisualDev:1111819318951419944>",
        }

        const user = interaction.options.getUser(`user`) || interaction.user;
        const userFlags = user.flags.toArray();
        const member = await interaction.guild.members.fetch(user.id);
        const topRoles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role)
        .slice(0, 1)
        const banner = await (await interaction.client.users.fetch(user.id, { force: true })).bannerURL({ size: 4096 });
        const booster = member.premiumSince ? `<:booster:1189781755721429094> Yes` : `No`; //Change the emoji
        const ownerE = `<:owner:1189781624850751568>,`// change the server owner emoji
        const devs = `<:VisualDev:1111819318951419944>,` // change the bot dev emoji
        const owners = [
            `526853643962679323`, // id for the devs of the bot
        ]
        const MutualServers = []
        const JoinPosition = await interaction.guild.members.fetch().then(Members => Members.sort((a, b) => a.joinedAt - b.joinedAt).map((User) => User.id).indexOf(member.id) + 1)

        for (const Guild of interaction.client.guilds.cache.values()) {
            if (Guild.members.cache.has(member.id)) {
                MutualServers.push(`[${Guild.name}](https://discord.com/guilds/${Guild.id})`)
            }
        }

        const bot = new EmbedBuilder() // you can remove this if you want
        .setColor(`Red`)
        .setDescription(`Bots are not available`)
        if (member.user.bot) return await interaction.channel.sendTyping(), await interaction.reply({ embeds: [bot]});

        const embed = new EmbedBuilder()
        .setAuthor({ name: `information`, iconURL: member.displayAvatarURL()})
        .setTitle(`**${member.user.tag}** ${userFlags.length ? formatter.format(userFlags.map(flag => `${badges[flag]}`)) : ` `}`)
        .setColor(`ffffff`)
        .setThumbnail(member.displayAvatarURL())
        .setDescription(`• **Id** - ${member.id}\n• **Boosted** - ${booster}\n• **Top Role** - ${topRoles}\n• **Joined** - <t:${parseInt(member.joinedAt / 1000)}:R>\n• **Discord User** - <t:${parseInt(user.createdAt / 1000)}:R>`)
        .addFields({ name: `Banner`, value: banner ? " " : "None"})
        .setImage(banner)
        .setFooter({ text: `${member ? `Join Position - ${JoinPosition} | ` : ''}Mutual Servers - ${MutualServers.length}`})
        
        // if the member id is equal to server owner
        if (member.id == interaction.guild.ownerId) {
            embed
            .setTitle(`**${member.user.tag}** ${ownerE} ${userFlags.length ? formatter.format(userFlags.map(flag => `${badges[flag]}`)) : ` `}`)
        }
        // if the member id is equal to the bot owners
        if (owners.includes(member.id)) {
            embed
            .setTitle(`**${member.user.tag}** ${devs} ${userFlags.length ? formatter.format(userFlags.map(flag => `${badges[flag]}`)) : ` `}`)
        }
        // if the member id is equal to server owner and bot owners
        if (owners.includes(member.id) && member.id == interaction.guild.ownerId) {
            embed
            .setTitle(`**${member.user.tag}** ${devs} ${ownerE} ${userFlags.length ? formatter.format(userFlags.map(flag => `${badges[flag]}`)) : ` `}`)
        }

        await interaction.channel.sendTyping(), await interaction.reply({ embeds: [embed] });
    }
}