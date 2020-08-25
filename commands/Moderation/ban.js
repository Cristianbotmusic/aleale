const { noSelfGetMember, timedEmbed } = require("../../functions.js");
const fs = require("fs");

module.exports = {
    name: "ban",
    guildOnly: true,
    aliases: [ "b" ], //must include
    permissions: [ "BAN_MEMBERS" ], //must include
    run: async (client, message, args) => {
        const member = noSelfGetMember(message, args.join(" "));

        if(!member) return timedEmbed(message, "**Task Failed**", "❌ No valid member provided.", "#e86418");

        member.ban({ reason: `Banned by ${message.author.tag}` }).then(m => {
            return timedEmbed(message, "**Task Successful**", `✅ Successfully banned ${m}`, "#e86418");
        }).catch(err => {
            return timedEmbed(message, "**Task Failed**", `❌ Error: ${err}`, "#e86418")
        });
    }
}

module.exports.help = {
    usage: "[prefix]ban <member>",
    description: "Bans a set member."
}