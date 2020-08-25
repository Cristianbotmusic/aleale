const { noSelfGetMember, timedEmbed } = require("../../functions.js");
const Discord = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "unmute",
    guildOnly: true,
    aliases: [ "um" ], //must include
    permissions: [ "MANAGE_ROLES" ], //must include
    run: async (client, message, args) => {
        const member = noSelfGetMember(message, args.join(" "));

        if (!member) return timedEmbed(message, "**Task Failed**", "❌ No valid member provided.", "#e86418");

        const muterole = member.roles.cache.find(role => role.name == "Muted");

        if (!muterole) return timedEmbed(message, "**Task Failed**", `❌ That person is not muted`, "#e86418");

        member.roles.remove(muterole).then(m => {
            timedEmbed(message, "**Task Successful**", `✅ Successfully unmuted ${m}`, "#e86418");
        });

        const log = JSON.parse(fs.readFileSync("./storage/config.json", "utf8"));

        if(log[message.guild.id] && log[message.guild.id].botlog) {
            const logchannel = message.guild.channels.cache.get(log[message.guild.id].botlog)

            const logembed = new Discord.MessageEmbed()
            .setTitle("Member unmuted")
            .addField("**Member:**", member)
            .addField("**Unmuted by:**", message.author)
            .setColor("#e86418")

            logchannel.send(logembed);
        }
    }
}

module.exports.help = {
    usage: "[prefix]unmute <member>",
    description: "Unmutes a set person."
}