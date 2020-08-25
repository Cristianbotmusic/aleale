const Discord = require("discord.js");
const { formatDate } = require("../../functions.js");

module.exports = {
    name: "serverinfo",
    aliases: ["si", "sinfo"], //must include
    cooldown: 10,
    guildOnly: true,
    permissions: [], //must include
    run: async (client, message, args) => {

        let region = {
            "brazil": ":flag_br: Brazil",
            "europe": ":flag_eu: Europe",
            "hongkong": ":flag_hk: Hong Kong",
            "singapore": ":flag_sg: Singapore",
            "us-central": ":flag_us: U.S. Central",
            "sydney": ":flag_au: Sydney",
            "us-east": ":flag_us: U.S. East",
            "us-south": ":flag_us: U.S. South",
            "us-west": ":flag_us: U.S. West",
            "japan": ":flag_jp: Japan",
            "russia": ":flag_ru: Russia",
            "southafrica": ":flag_za:  South Africa",
            "india": ":flag_in: India"
        }

        var emojis;
        if (message.guild.emojis.cache.size === 0) {
            emojis = "None";
        } else if(message.guild.premiumTier == 0) {
            emojis = String(message.guild.emojis.cache.size) + "/50";
        } else if(message.guild.premiumTier == 1) {
            emojis = String(message.guild.emojis.cache.size) + "/100";
        } else if(message.guild.premiumTier == 2) {
            emojis = String(message.guild.emojis.cache.size) + "/150";
        } else if(message.guild.premiumTier == 3) {
            emojis = String(message.guild.emojis.cache.size) + "/250";
        }

        const roles = message.guild.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || "none";

        var vlevel = message.guild.verificationLevel;

        if (vlevel === "NONE") vlevel = "none"

        const sinfo = new Discord.MessageEmbed()
            .setTitle(message.guild.name)
            .setThumbnail(message.guild.iconURL())
            .addField("**Created on:**", formatDate(message.guild.createdAt), true)
            .addField("**Owner:**", message.guild.owner.user.tag, true)
            .addField("**ID:**", message.guild.id, true)
            .addField("**Region:**", region[message.guild.region], true)
            .addField("**Members:**", message.guild.members.cache.filter(m => !m.user.bot).size, true)
            .addField("**Bots:**", message.guild.members.cache.filter(m => m.user.bot).size, true)
            .addField("**Channels:**", message.guild.channels.cache.filter(channel => channel.type == "text" || channel.type == "voice").size, true)
            .addField("**Emojis:**", `${emojis}`, true)
            .addField("**Boost Tier:**", message.guild.premiumTier, true)
            .addField("**Boosters:**", message.guild.premiumSubscriptionCount, true)
            .addField("**AFK Timeout:**", message.guild.afkTimeout / 60 + " minutes", true)
            .addField("**Verification Level:**", vlevel, true)
            .addField("**Roles:**", roles)
            .setTimestamp()
            .setColor("#e86418");


        message.channel.send(sinfo)
    }
}

module.exports.help = {
    usage: "[prefix]serverinfo",
    description: "Shows you a bunch of information about the server."
}
