const { noSelfGetMember, timedEmbed } = require("../../functions.js");
const fs = require("fs");

module.exports = {
    name: "kick",
    guildOnly: true,
    aliases: [ "k" ], //must include
    permissions: [ "KICK_MEMBERS" ], //must include
    run: async (client, message, args) => {
        const member = noSelfGetMember(message, args.join(" "));

        if(!member) return timedEmbed(message, "**Task Failed**", "❌ No valid member provided.", "#e86418");

        member.kick().then(m => {
            return timedEmbed(message, "**Task Successful**", `✅ Successfully kicked ${m}`, "#e86418");
        }).catch(err => {
            return timedEmbed(message, "**Task Failed**", `❌ Error: ${err}`, "#e86418")
        });
    }
}

module.exports.help = {
    usage: "[prefix]kick <member>",
    description: "Kicks the given member"
}