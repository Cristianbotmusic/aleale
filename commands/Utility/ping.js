const { MessageFlags } = require("discord.js")

module.exports = {
    name: "ping",
    aliases: [ "p" ],
    cooldown: 10,
    permissions: [],
    run: async (client, message, args) => {
        message.channel.send(`🏓 Pong! ${client.ws.ping} ms.`)
    }
}

module.exports.help = {
    name: "ping",
    usage: "[prefix]ping",
    description: "Pong!"
}