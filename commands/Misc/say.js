const { timedEmbed } = require("../../functions.js");

module.exports = {
    name: "say",
    aliases: ["s"], //must include
    permissions: [], //must include
    run: async (client, message, args) => {
        let text = args.join(" ");

        message.delete();

        if (!text) return message.channel.send(timedEmbed(message, "**Task Failed**", "❌ Can't send empty message.", "#e86418"))
        if (message.content.includes("@everyone") || message.content.includes("@here"))
            return message.channel.send(timedEmbed(message, "**Task Failed**", "❌ You can't make me ping everyone >:(", "#e86418"));

        message.channel.send(text);
    }
}


module.exports.help = {
    usage: "[prefix]say <stuff>",
    description: "It makes the bot say stuff."
}