const mc = require("minecraft-server-util");
const Discord = require("discord.js");
const { timedEmbed } = require("../../functions.js");

module.exports = {
    name: "server",
    aliases: [], //must include
    cooldown: 10,
    permissions: [], //must include
    run: async (client, message, args) => {
        let ip = args[0];
        let port = args[1];

        if (!ip)
            timedEmbed(message, "**Task Failed**", "❌ No ip provided.", "#e86418");
        if (!port)
            port = 25565;

        mc(ip, parseInt(port), (error, reponse) => {
            if (error) {
                return timedEmbed(message, "**Task Failed**", "❌ Invalid ip address.", "#e86418");;
            }
            let mcembed = new Discord.MessageEmbed()
                .setTitle("Server status:")
                .setThumbnail("https://seeklogo.com/images/M/minecraft-logo-5EAD3A1535-seeklogo.com.png")
                .setColor("#e86418")
                .addField("**IP:**", reponse.host)
                .addField("**Version:**", reponse.version)
                .addField("**People online:**", reponse.onlinePlayers + "/" + reponse.maxPlayers);

            message.channel.send(mcembed);
        });
    }
}

module.exports.help = {
    usage: "[prefix]server <ip> {port}",
    description: "Shows you the status of a minecraft server."
}
