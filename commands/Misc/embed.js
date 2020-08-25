const Discord = require("discord.js");
const { timedEmbed } = require("../../functions.js");

module.exports = {
    name: "embed",
    aliases: ["em"], //must include
    cooldown: 10,
    permissions: [], //must include
    run: async (client, message, args) => {
        timedEmbed(message, "**What would you like the title to be?**", `If you want to leave this field empty then please respond with !empty`, "#e86418");

        var embed = new Discord.MessageEmbed();
        var channel = message.channel;
        var invalid = false;

        await message.channel.awaitMessages(m => m.author.id == message.author.id,
            { max: 1, time: 30000 }).then(collected => {

                if (collected.first().content != "!empty") {
                    embed.setTitle(collected.first().content);
                }

            }).catch((err) => {
                return timedEmbed(message, "**Task Failed**", "❌ No answer after 30 seconds.", "#e86418");
            });

        timedEmbed(message, "**What would you like the description to be?**", `If you want to leave this field empty then please respond with !empty`, "#e86418");

        await message.channel.awaitMessages(m => m.author.id == message.author.id,
            { max: 1, time: 30000 }).then(collected => {

                if (collected.first().content != "!empty") {
                    embed.setDescription(collected.first().content);
                }

            }).catch((err) => {
                return timedEmbed(message, "**Task Failed**", "❌ No answer after 30 seconds.", "#e86418");
            });

        timedEmbed(message, "**What would you like the footer to be?**", `If you want to leave this field empty then please respond with !empty`, "#e86418");

        await message.channel.awaitMessages(m => m.author.id == message.author.id,
            { max: 1, time: 30000 }).then(collected => {

                if (collected.first().content != "!empty") {
                    embed.setFooter(collected.first().content);
                }

            }).catch((err) => {
                return timedEmbed(message, "**Task Failed**", "❌ No answer after 30 seconds.", "#e86418");
            });

        timedEmbed(message, "**What channel yould you like to send this in?**", `If you want it to be this channel you can respond with !this`, "#e86418");

        await message.channel.awaitMessages(m => m.author.id == message.author.id,
            { max: 1, time: 30000 }).then(collected => {

                if (collected.first().content != "!this" && collected.first().mentions.channels.first()) {
                    channel = collected.first().mentions.channels.first();
                } else if (collected.first().content != "!this" && !collected.first().mentions.channels.first()) {
                    invalid = true;
                    return timedEmbed(message, "**Task Failed**", "❌ Invalid channel.", "#e86418");
                }

            }).catch((err) => {
                return timedEmbed(message, "**Task Failed**", "❌ No answer after 30 seconds.", "#e86418");
            });

        embed.setColor("#e86418")

        if (invalid == true) return;

        channel.send(embed);
    }
}

module.exports.help = {
    usage: "[prefix]embed",
    description: "Allows you too send a custom embed in any channel."
}
