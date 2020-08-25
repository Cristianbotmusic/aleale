const { timedEmbed } = require("../../functions.js");

module.exports = {
    name: "eval",
    aliases: [],
    botOwnerOnly: true,
    permissions: [],
    run: async (client, message, args) => {
        if(!args[0]) return message.channel.send(timedEmbed(message, "**Task Failed**", "❌ Nothing to evaluate.", "#e86418"));
        const code = args.join(" ");
		try {
			var result = eval(code);
			return message.channel.send(timedEmbed(message, "**Task successful**", `✅ ${result}`, "#e86418"));
		} catch(err) {
			return message.channel.send(timedEmbed(message, "**Task Failed**", "❌ " + err, "#e86418"));
		}
    }
}

module.exports.help = {
    usage: "[prefix]eval <code>",
    description: "Evaluates the given code."
}