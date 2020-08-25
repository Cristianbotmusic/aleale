const { noSelfGetMember, timedEmbed } = require("../../functions.js");
const Discord = require("discord.js");
const ms = require("ms");
const fs = require("fs");

module.exports = {
    name: "tempmute",
    guildOnly: true,
    aliases: [ "tm" ], //must include
    permissions: [ "MANAGE_ROLES" ], //must include
    run: async (client, message, args) => {
        const member = noSelfGetMember(message, args[0]);

        const mutetime = args.slice(1).join(" ");

        if (!member) return timedEmbed(message, "**Task Failed**", "❌ No valid member provided.", "#e86418");

        if (member.permissions.has("MANAGE_ROLES")) return timedEmbed(message, "**Task Failed**", "❌ Can't mute them.", "#e86418");

        if (member.roles.cache.find(role => role.name == "Muted")) return timedEmbed(message, "**Task Failed**", `❌ That person is already muted`, "#e86418");

        if (!mutetime) return timedEmbed(message, "**Task Failed**", "❌ No time provided.", "#e86418");

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
            timedEmbed(message, "**Task Successful**", `✅ Successfully muted ${m} for ${mutetime}`, "#e86418");
        });

        const log = JSON.parse(fs.readFileSync("./storage/config.json", "utf8"));

        if(log[message.guild.id] && log[message.guild.id].botlog) {
            const logchannel = message.guild.channels.cache.get(log[message.guild.id].botlog)

            const logembed = new Discord.MessageEmbed()
            .setTitle("Member tempmuted")
            .addField("**Member:**", member)
            .addField("**Tempmuted by:**", message.author)
            .addField("**Time:**", mutetime)
            .setColor("#e86418")

            logchannel.send(logembed);
        }

        setTimeout(function () {
            member.roles.remove(muterole).then(m => {
                timedEmbed(message, "**Task Successful**", `✅ Successfully unmuted ${m}`, "#e86418");
            });
        }, ms(mutetime));
    }
}

module.exports.help = {
    usage: "[prefix]tempmute <member> <time>",
    description: "Temporarily mutes someone for a set amout of time."
}