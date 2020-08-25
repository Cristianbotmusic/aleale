module.exports = {
    name: "uptime",
    aliases: [ "ut", "utime" ], //must include
    cooldown: 10,
    permissions: [], //must include
    run: async (client, message, args) => {
        seconds = parseInt((client.uptime / 1000) % 60),
        minutes = parseInt((client.uptime / (1000 * 60)) % 60),
        hours = parseInt((client.uptime / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        message.channel.send(`📈 The bot has been running for **${hours}** hours **${minutes}** minutes and **${seconds}** seconds.`);
    }
}

module.exports.help = {
    usage: "[prefix]uptime",
    description: "Tells you the uptime of the bot"
}