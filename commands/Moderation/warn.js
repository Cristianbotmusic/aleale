const { noSelfGetMember, timedEmbed } = require("../../functions.js");
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    name: "warn",
    guildOnly: true,
    aliases: ["w"], //must include
    permissions: [ "KICK_MEMBERS" ], //must include
    run: async (client, message, args) => {
        const member = noSelfGetMember(message, args[0]);

        const reason = args.slice(1).join(" ");

        if (!member) return timedEmbed(message, "**Task Failed**", "❌ No valid member provided.", "#e86418");

        if (!reason) return timedEmbed(message, "**Task Failed**", "❌ No reason provided.", "#e86418");

        let warns = JSON.parse(fs.readFileSync("./storage/warnings.json", "utf8"));

        if(!warns[`${member.id}, ${message.guild.id}`]) warns[`${member.id}, ${message.guild.id}`] = {
            warns: 0
        };

        warns[`${member.id}, ${message.guild.id}`].warns++;

        if (!warns[`${member.id}, ${message.guild.id}`].reasons) {
            warns[`${member.id}, ${message.guild.id}`].reasons = reason;
        } else {
            warns[`${member.id}, ${message.guild.id}`].reasons += `, ${reason}`;
        }

        fs.writeFile("./storage/warnings.json", JSON.stringify(warns), err => {
          if(err) throw err;
        });

        const log = JSON.parse(fs.readFileSync("./storage/config.json", "utf8"));

        if(log[message.guild.id] && log[message.guild.id].botlog) {
            const logchannel = message.guild.channels.cache.get(log[message.guild.id].botlog)

            const logembed = new Discord.MessageEmbed()
            .setTitle("New warning")
            .addField("**Member:**", member)
            .addField("**Warned by:**", message.author)
            .addField("**Reason:**", reason)
            .setColor("#e86418")

            logchannel.send(logembed);
        }

        const dmembed = new Discord.MessageEmbed()
        .setTitle("You have been warned!")
        .addField("**Guild:**", message.member.guild)
        .addField("**Warned by:**", message.author.tag)
        .addField("**Reason:**", reason)
        .setColor("#e86418")

        member.send(dmembed);

        timedEmbed(message, "**Task successful**", `✅ Successfully warned ${member}`, "#e86418");
        
    }
}

module.exports.help = {
    usage: "[prefix]warn <member> <reason>",
    description: "Warns a person."
}