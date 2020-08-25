const { timedEmbed } = require("../../functions.js");
const fs = require("fs");

module.exports = {
    name: "antispam",
    aliases: [ "as" ], //must include
    guildOwnerOnly: true,
    permissions: [], //must include
    run: async (client, message, args) => {
        let conf = JSON.parse(fs.readFileSync("./storage/config.json", "utf8"));

        if (!conf[message.guild.id])
            conf[message.guild.id] = {}

        if (!conf[message.guild.id].antispam)
            conf[message.guild.id].antispam = false;

            timedEmbed(message, "**Antispam Setup**", `Do you want to toggle antispam? (Current status: \`${conf[message.guild.id].antispam}\`) Respond with y if yes and with n if no.`, "#e86418");

            await message.channel.awaitMessages(m => m.author.id == message.author.id,
                { max: 1, time: 30000 }).then(collected => {
    
                    if (collected.first().content == "y") {
                        conf[message.guild.id].antispam = !conf[message.guild.id].antispam;
                        timedEmbed(message, "**Task successful**", `✅ Successfully set antispam status.`, "#e86418");
                    } else if (collected.first().content == "n") {
                        return timedEmbed(message, "**Task Failed**", "❌ Task cancelled.", "#e86418");
                    } else {
                        return timedEmbed(message, "**Task Failed**", "❌ Invalid input.", "#e86418");
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
    usage: "[prefix]antispam",
    description: "Allows you to toggle antispam."
}