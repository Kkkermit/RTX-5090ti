const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const ascii = require("ascii-table");
const table = new ascii().setHeading("File Name", "Status");

const clientId = '1189630675918262282'; 
const guildId = '1060865173629448212'; 

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];
        for (folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`../commands/${folder}/${file}`);
                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());

                if (command.name) {
                    client.commands.set(command.name, command);
                    table.addRow(file, "✅");
            
                    if (command.aliases && Array.isArray(command.aliases)) {
                      command.aliases.forEach((alias) => {
                        client.aliases.set(alias, command.name);
                      });
                    }
                  } else {
                    table.addRow(file, "✅");
                    continue;
                  }
            }
        }

        console.log(table.toString(), "\n✅ Loaded Slash Commands");

        const rest = new REST({
            version: '9'
        }).setToken(process.env.token);

        (async () => {
            try {
                console.log('Started refreshing application (/) commands.');

                await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: client.commandArray
                    },
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        })();
    };
};