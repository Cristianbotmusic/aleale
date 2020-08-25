const { getMember } = require("../../functions.js");
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    name: "warnings",
    aliases: [ "ws" ], //must include
    cooldown: 10,
    guildOnly: true,
    permissions: [], //must include
    run: async (client, message, args) => {
        const member = getMember(message, args.join(" "));

        const warns = JSON.parse(fs.readFileSync("./storage/warnings.json", "utf8"));

        if(!warns[`${member.id}, ${message.guild.id}`]) warns[`${member.id}, ${message.guild.id}`] = {
            warns: 0
        };

        
        const warnings = warns[`${member.id}, ${message.guild.id}`].warns;

        let warnembed = new Discord.MessageEmbed()
        .setAuthor(member.displayName, member.user.displayAvatarURL())
        .setColor("#e86418")
        .addField("**Warnings:**", warnings)
        .setTimestamp()

        if(warns[`${member.id}, ${message.guild.id}`].reasons) {
            warnembed.addField("**Reason(s):**", warns[`${member.id}, ${message.guild.id}`].reasons)
        }

        message.channel.send(warnembed);
    }
}

module.exports.help = {
    usage: "[prefix]warnings {member}",
    description: "Shows you your or someone else's warnings."
}