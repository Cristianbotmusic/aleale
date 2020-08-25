const Discord = require("discord.js");

module.exports = {
    timedEmbed: function (message, title, description, color) {
        embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(color)
        .setFooter("This message gets deleted in 30 seconds.")
        .setTimestamp();
    
        return message.channel.send(embed).then(msg => {
            msg.delete({ timeout: 30000 })
        });
    },
    formatDate: function (date) {
        return new Intl.DateTimeFormat("en-US").format(date)
    },
    getMember: function (message, toFind = "") {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);

        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
            });
        }

        if (!target)
            target = message.member;

        return target;
    },
    noSelfGetMember: function (message, toFind = "") {
        toFind = toFind.toLowerCase();

        let target = message.guild.members.cache.get(toFind);

        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.cache.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
            });
        }

        return target;
    },
    objSize: function (obj) {
        var size = 0, key;
        for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    }
}