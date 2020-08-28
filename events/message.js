const Discord = require("discord.js");
const { timedEmbed, objSize } = require("../functions.js");
const fs = require("fs");

const cooldowns = new Discord.Collection();

module.exports = async (client, message) => {
  if (message.author.bot) return;

  let args = [];

  if(message.guild) {
    let conf = JSON.parse(fs.readFileSync("./storage/config.json", "utf8"));

    if (!conf[message.guild.id])
      conf[message.guild.id] = {}
  
    if (!conf[message.guild.id].keywords)
      conf[message.guild.id].keywords = false;
  
      if (!conf[message.guild.id].antiinvite)
      conf[message.guild.id].antiinvite = false;

    if (conf[message.guild.id].keywords == true) {
      const keywords = JSON.parse(fs.readFileSync("./storage/keywords.json", "utf8"));
  
      for (let i = 0; i < objSize(keywords); i++) {
        if (message.content.toLowerCase().includes(keywords[String(i)].name)) {
          timedEmbed(keywords[String(i)].title, keywords[String(i)].description, "#e86418")
        }
      }
    }

    if (conf[message.guild.id].antiinvite == true) {
      var msg = message.content;

      msg = msg.toLowerCase().replace(/\s/g, '');

      if (msg.includes("discord.gg") || msg.includes("discord.com/invite")) {
        message.delete()
        timedEmbed(message, "**Deleted message**", "❌ Invite links are disabled on this server.", "#e86418")
      }
    }

    if (conf[message.guild.id].prefix) {
      if (!message.content.startsWith(conf[message.guild.id].prefix)) return;
      args = message.content.slice(conf[message.guild.id].prefix.length).trim().split(/ +/g);
    } else {
      if (!message.content.startsWith(client.config.prefix)) return;
      args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
    }
  } else {
    if (!message.content.startsWith(client.config.prefix)) return;
    args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  }

  const command = args.shift().toLowerCase();

  if (message.client.commands.has(command)) cmd = message.client.commands.get(command);
  else if (message.client.aliases.has(command)) cmd = message.client.aliases.get(command);
  else return;

  if (!cmd) return;

  //* guildOnly

  if (cmd.guildOnly && !message.guild) return timedEmbed(message, "**Task Failed**", "❌ This command is guild only.", "#e86418");

  //* disabled

  if (cmd.disabled) timedEmbed(message, "**Task Failed**", "❌ This command is disabled.", "#e86418");

  //* botOwnerOnly

  if (cmd.botOwnerOnly && !client.config.owners.includes(message.author.id)) return timedEmbed(message, "**Task Failed**", "❌ This command is (bot)owner only.", "#e86418");

  //* guildOwnerOnly

  if (cmd.guildOwnerOnly && message.guild.ownerID != message.author.id) return timedEmbed(message, "**Task Failed**", "❌ This command is (guild)owner only.", "#e86418");

  //* nsfwOnly

  if (cmd.nsfwOnly && !message.channel.nsfw) return timedEmbed(message, "**Task Failed**", "❌ This command is nsfw only.", "#e86418");

  //* permissions

  if (cmd.permissions.lenght != 0 && !(message.client.config.owners.includes(message.author.id) || message.member.permissions.has(cmd.permissions))) return timedEmbed(message, "**Task Failed**", `❌ You need \`${cmd.permissions.join(", ")}\` permission(s) to run this command.`, "#e86418");

  //* cooldown

  if (cmd.cooldown) {
    if (!cooldowns.has(cmd.name)) {
      cooldowns.set(cmd.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(cmd.name);
    const cooldownAmount = cmd.cooldown * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return timedEmbed(message, "**Task Failed**", `❌ Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${cmd.name}\` command.`, "#e86418");
      }
    }

    cmd.run(client, message, args);

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  } else {
    cmd.run(client, message, args);
  }

};