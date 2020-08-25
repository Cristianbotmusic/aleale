const { timedEmbed } = require("../../functions.js");
const fs = require("fs");

module.exports = {
    name: "botlog",
    aliases: [ "bl" ], //must include
    guildOnly: true,
    guildOwnerOnly: true,
    permissions: [], //must include
    run: async (client, message, args) => {
        timedEmbed(message, "**Botlog Setup**", "Please mention a channel to set as the botlog channel.", "#e86418")

        var channel = "";

        await message.channel.awaitMessages(m => m.author.id == message.author.id,
            { max: 1, time: 30000 }).then(collected => {

                if (collected.first().mentions.channels.first()) {
                    channel = collected.first().mentions.channels.first().id;
                    timedEmbed(message, "**Task successful**", `✅ Successfully set botlog.`, "#e86418");
                }

                else {
                    return timedEmbed(message, "**Task Failed**", "❌ No valid channel provided.", "#e86418");
                }
            }).catch((err) => {
                return timedEmbed(message, "**Task Failed**", "❌ No answer after 30 seconds.", "#e86418");
            });

        let conf = JSON.parse(fs.readFileSync("./storage/config.json", "utf8"));

        if(!conf[message.guild.id])
            conf[message.guild.id] = {}

        conf[message.guild.id].botlog = channel;

        fs.writeFile("./storage/config.json", JSON.stringify(conf), err => {
            if(err) throw err;
        });
    }
}

module.exports.help = {
    usage: "[prefix]botlog",
    description: "Allows you to set a channel as a log channel where bot only actions will get logged (ex: mute)."
}