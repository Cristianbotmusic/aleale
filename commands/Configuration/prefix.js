const { timedEmbed } = require("../../functions.js");
const fs = require("fs");

module.exports = {
    name: "prefix",
    aliases: [ "pr" ], //must include
    guildOwnerOnly: true,
    guildOnly: true,
    permissions: [], //must include
    run: async (client, message, args) => {
        let conf = JSON.parse(fs.readFileSync("./storage/config.json", "utf8"));

        if (!conf[message.guild.id])
            conf[message.guild.id] = {}

        if (!conf[message.guild.id].prefix)
            conf[message.guild.id].prefix = client.config.prefix;

            timedEmbed(message, "**Prefix Setup**", `What do you want the prefix to be? Respond with the prefix or if you want to cancel it respond with cancel to cancel the command.`, "#e86418");

            await message.channel.awaitMessages(m => m.author.id == message.author.id,
                { max: 1, time: 30000 }).then(collected => {
    
                    if (collected.first().content != "cancel") {
                        conf[message.guild.id].prefix = collected.first().content;
                        timedEmbed(message, "**Task successful**", `✅ Successfully set new prefix.`, "#e86418");
                    } else {
                        return timedEmbed(message, "**Task Failed**", "❌ Task cancelled.", "#e86418");
                    }
                }).catch((err) => {
                    return timedEmbed(message, "**Task Failed**", "❌ No answer after 30 seconds.", "#e86418");
                });
    
            fs.writeFile("./storage/config.json", JSON.stringify(conf), err => {
                if (err) throw err;
            });
    }
}

module.exports.help = {
    usage: "[prefix]prefix",
    description: "Allows you to set the prefix on the server."
}