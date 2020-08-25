module.exports = {
    name: "hi",
    aliases: [], //must include
    cooldown: 3,
    guildOnly: false,
    disabled: false,
    botOwnerOnly: false,
    guildOwnerOnly: false,
    nsfwOnly: false,
    permissions: [], //must include
    run: async (client, message, args) => {
        
    }
}

module.exports.help = {
    usage: "[prefix]help {command}",
    description: "Shows you some info about other commands."
}

