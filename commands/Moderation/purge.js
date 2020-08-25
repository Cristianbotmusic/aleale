const { timedEmbed } = require("../../functions.js");
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
    name: "purge",
    aliases: [ "pu" ], //must include
    permissions: [ "MANAGE_MESSAGES" ], //must include
    run: async (client, message, args) => {
        amount = args.join(" ");

        if(!amount)
            return timedEmbed(message, "**Task Failed**", "❌ No amount provided.", "#e86418");

        await message.delete();

        await message.channel.bulkDelete(amount)

        const log = JSON.parse(fs.readFileSync("./storage/config.json", "utf8"));

        if(log[message.guild.id] && log[message.guild.id].botlog) {
            const logchannel = message.guild.channels.cache.get(log[message.guild.id].botlog)

            const logembed = new Discord.MessageEmbed()
            .setTitle("Messages purged")
            .addField("**Amount:**", amount)
            .addField("**Channel:**", message.channel)
            .addField("**Purged by:**", message.author)
            .setColor("#e86418")

            logchannel.send(logembed);
        }

        return timedEmbed(message, "**Task Sucessful**", `✅ Successfully deleted ${amount} messages.`, "#e86418");
    }
}

module.exports.help = {
    usage: "[prefix]purge <amount>",
    description: "Deletes a set amount of messages."
}