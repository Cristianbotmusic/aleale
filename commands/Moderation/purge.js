const { timedEmbed } = require("../../functions.js");

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

        return timedEmbed(message, "**Task Sucessful**", `✅ Successfully deleted ${amount} messages.`, "#e86418");
    }
}

module.exports.help = {
    usage: "[prefix]purge <amount>",
    description: "Deletes a set amount of messages."
}