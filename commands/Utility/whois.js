const { getMember, formatDate } = require("../../functions.js");
const Discord = require("discord.js");

module.exports = {
    name: "whois",
    aliases: ["wi", "wis"], //must include
    cooldown: 10,
    permissions: [], //must include
    run: async (client, message, args) => {
        const member = getMember(message, args.join(" "));

        const joined = formatDate(member.joinedAt);
        const created = formatDate(member.user.createdAt);
        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || "none";

        const uinfo = new Discord.MessageEmbed()
            .setColor("#e86418")
            .setAuthor(member.displayName, member.user.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL)
            .addField("**Joined at:**", joined, true)
            .addField("**Created at:**", created, true)
            .addField("**ID:**", member.user.id)
            .addField("**Display name:**", member.displayName, true)
            .addField("**User tag:**", member.user.tag, true)
            .addField("**Roles:**", roles)
            .setTimestamp()

        if (member.user.presence.activities.length != 0)
            uinfo.setFooter("Currently playing " + member.user.presence.activities.join(", "));

        message.channel.send(uinfo);
    }
}

module.exports.help = {
    usage: "[prefix]whois {users}",
    description: "Shows you some info about yourself or an other user."
}