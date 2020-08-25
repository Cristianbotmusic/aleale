const Discord = require("discord.js");
const { Menu } = require("discord.js-menu");
const fs = require("fs");
const { timedEmbed } = require("../../functions.js");

module.exports = {
    name: "help",
    aliases: [ "h" ],
    cooldown: 10,
    guildOnly: true,
    permissions: [],
    run: async (client, message, args) => {
        //* all commands

        if (!args[0]) {
            const ucm = client.commands.map(command => {
                if ((command.permissions && !(message.client.config.owners.includes(message.author.id) || message.member.permissions.has(command.permissions))) || (command.guildOwnerOnly && message.author.id != message.guild.ownerID) || (command.botOwnerOnly && !client.config.owners.includes(message.author.id))) return null;
                return `▷ **${command.group}:** \`${command.name}\``;
            })
    
            const acm = client.commands.map(command => {
                return `▷ **${command.group}:** \`${command.name}\``;
            })

            new Menu(message.author, message.author.id, [
                {
                    name: "util",
                    content: new Discord.MessageEmbed({
                        title: "Accessible Commands:",
                        description: `${ucm.filter(e => {return e !== null}).join("\n")}\n\n*Press 🟥 to view all commands*`,
                        color: "#e86418",
                        timestamp: new Date(),
                        footer: {
                            text: "Bot made by Lorem ipsum#2364"
                        }
                    }),
                    reactions: {
                        "🟥": "next",
                        "🟩": "previous"
                    }
                },
                {
                    name: "util",
                    content: new Discord.MessageEmbed({
                        title: "All Commands:",
                        description: `${acm.join("\n")}\n\n*Press 🟩 to only view accessible commands*`,
                        color: "#e86418",
                        timestamp: new Date(),
                        footer: {
                            text: "Bot made by Lorem ipsum#2364"
                        }
                    }),
                    reactions: {
                        "🟥": "next",
                        "🟩": "previous"
                    }
                }
            ]);

            message.reply("Sent you a dm.");

            console.clear(); //I do this cou there is an error from the menu module that makes no sense and the only purpose it serves is to annoy me (like really, the command works i see no reason for that error to appear)
        }


        //* specific command

        if (!args[0]) return;

        const name = args[0].toLowerCase();
        const command = client.commands.get(name) || client.commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) return message.channel.send(timedEmbed(message, "**Task Failed**", "❌ Couldn't find command.", "#e86418"))

        const cmdBasic = {
            name: command.name,
            description: command.help.description,
            usage: command.help.usage
        }

        const cmdAdvanced = {
            aliases: "none",
            cooldown: "none",
            group: "none",
            guildOnly: "false",
            disabled: "false",
            botOwnerOnly: "false",
            guildOwnerOnly: "false",
            nsfwOnly: "false",
            permissions: "none"
        }

            if (command.permissions.length != 0)
                cmdAdvanced.permissions = command.permissions.join(", ");
            if (command.aliases.length != 0)
                cmdAdvanced.aliases = command.aliases.join(", ");
            if (command.cooldown)
                cmdAdvanced.cooldown = String(command.cooldown);
            if (command.group)
                cmdAdvanced.group = command.group;
            if (command.guildOnly)
                cmdAdvanced.guildOnly = String(command.guildOnly);
            if (command.disabled)
                cmdAdvanced.disabled = String(command.disabled);
            if (command.botOwnerOnly)
                cmdAdvanced.botOwnerOnly = String(command.botOwnerOnly);
            if (command.guildOwnerOnly)
                cmdAdvanced.guildOwnerOnly = String(command.guildOwnerOnly);
            if (command.nsfwOnly)
                cmdAdvanced.nsfwOnly = String(command.nsfwOnly);

        new Menu(message.author, message.author.id, [
            {
                name: "basic",
                content: new Discord.MessageEmbed({
                    title: "Basic Information:",
                    fields: [
                        {
                            name: "**Name:**",
                            value: `\`${cmdBasic.name}\``
                        },
                        {
                            name: "**Description:**",
                            value: `\`${cmdBasic.description}\``
                        },
                        {
                            name: "**Usage:**",
                            value: `\`${cmdBasic.usage}\``
                        }
                    ],
                    color: "#e86418",
                    timestamp: new Date(),
                    footer: {
                        text: "<> means must have {} means optional in usage."
                    }
                }),
                reactions: {
                    "◀️": "previous",
                    "▶️": "next"
                }
            },
            {
                name: "advanced",
                content: new Discord.MessageEmbed({
                    title: "Advanced Information:",
                    fields: [
                        {
                            name: "**Aliases:**",
                            value: `\`${cmdAdvanced.aliases}\``
                        },
                        {
                            name: "**Group:**",
                            value: `\`${cmdAdvanced.group}\``
                        },
                        {
                            name: "**Cooldown:**",
                            value: `\`${cmdAdvanced.cooldown}\``
                        },
                        {
                            name: "**GuildOnly:**",
                            value: `\`${cmdAdvanced.guildOnly}\``
                        },
                        {
                            name: "**BotOwnerOnly:**",
                            value: `\`${cmdAdvanced.botOwnerOnly}\``
                        },
                        {
                            name: "**GuildOwnerOnly:**",
                            value: `\`${cmdAdvanced.guildOwnerOnly}\``
                        },
                        {
                            name: "**NsfwOnly:**",
                            value: `\`${cmdAdvanced.nsfwOnly}\``
                        },
                        {
                            name: "**Disabled:**",
                            value: `\`${cmdAdvanced.disabled}\``
                        },
                        {
                            name: "**PermissionsRequired:**",
                            value: `\`${cmdAdvanced.permissions}\``
                        }
                    ],
                    color: "#e86418",
                    timestamp: new Date()
                }),
                reactions: {
                    "◀️": "previous",
                    "▶️": "next"
                }
            }
        ]);

        message.reply("Sent you a dm.");

        console.clear(); //I do this cou there is an error from the menu module that makes no sense and the only purpose it serves is to annoy me (like really, the command works i see no reason for that error to appear)
    }
}

module.exports.help = {
    usage: "[prefix]help {command}",
    description: "Shows you some info about other commands."
}