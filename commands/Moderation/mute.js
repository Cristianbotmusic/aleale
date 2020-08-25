const { noSelfGetMember, timedEmbed } = require("../../functions.js");
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    name: "mute",
    guildOnly: true,
    aliases: [ "m" ], //must include
    permissions: [ "MANAGE_ROLES" ], //must include
    run: async (client, message, args) => {
        const member = noSelfGetMember(message, args.join(" "));

        if (!member) return timedEmbed(message, "**Task Failed**", "❌ No valid member provided.", "#e86418");

        if (member.permissions.has("MANAGE_ROLES")) return timedEmbed(message, "**Task Failed**", "❌ Can't mute them.", "#e86418");

        if (member.roles.cache.find(role => role.name == "Muted")) return timedEmbed(message, "**Task Failed**", `❌ That person is already muted`, "#e86418");

        let muterole = message.guild.roles.cache.find(role => role.name == "Muted") || await message.guild.roles.create({
            data: {
                name: "Muted",
                color: "GRAY",
            },
            reason: "Mute a user",
        });

        message.guild.channels.cache.forEach(channel => {
            channel.overwritePermissions([
                {
                    id: muterole.id,
                    deny: ["SEND_MESSAGES", "ADD_REACTIONS", "CONNECT"],
                },
            ]);
        });

        member.roles.add(muterole).then(m => {
            timedEmbed(message, "**Task Successful**", `✅ Successfully muted ${m}`, "#e86418");
        });

        const log = JSON.parse(fs.readFileSync("./storage/config.json", "utf8"));

        if(log[message.guild.id] && log[message.guild.id].botlog) {
            const logchannel = message.guild.channels.cache.get(log[message.guild.id].botlog)

            const logembed = new Discord.MessageEmbed()
            .setTitle("Member muted")
            .addField("**Member:**", member)
            .addField("**Muted by:**", message.author)
            .setColor("#e86418")

            logchannel.send(logembed);
        }
    }
}

module.exports.help = {
    usage: "[prefix]mute <member>",
    description: "Mutes a set member."
}