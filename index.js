const Discord = require("discord.js");
const fs = require("fs");
const path = require("path");
const client = new Discord.Client();
const config = require("./storage/botconfig.json");
const AntiSpam = require('discord-anti-spam');
client.config = config;

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    console.log(`<Loading event>: ${file}`);
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
  });
});

const Commands = new Discord.Collection();
const Aliases = new Discord.Collection();

const groups = fs.readdirSync("./commands").filter(file => fs.statSync(path.join("./commands", file)).isDirectory());
for (let group of groups) {
  console.log(`[Loading module]: ${group}`);
  let commandFiles = fs.readdirSync(path.resolve(`./commands/${group}`)).filter(file => !fs.statSync(path.resolve("./commands/", group, file)).isDirectory()).filter(file => file.endsWith(".js"));
  for (let file of commandFiles) {
    console.log(`{Loading command}: ${file}`);
    file = require(`./commands/${group}/${file}`);
    file.group = group;
    Commands.set(file.name, file);
    for (let alias of file.aliases) Aliases.set(alias, file);
  }
}

const antiSpam = new AntiSpam({
  warnThreshold: 3, 
  kickThreshold: 7, 
  banThreshold: 10, 
  maxInterval: 3000,
  maxDuplicatesInterval: 10000,
  warnMessage: "{@user}, Please stop spamming.", 
  kickMessage: "**{user_tag}** has been kicked for spamming.", 
  banMessage: "**{user_tag}** has been banned for spamming.",
  maxDuplicatesWarning: 2, 
  maxDuplicatesKick: 4, 
  maxDuplicatesBan: 6, 
  exemptPermissions: [ "ADMINISTRATOR" ], 
  ignoreBots: true, 
  verbose: true, 
  ignoredUsers: [], 
});

//* this is for the antispam ONLY
client.on('message', (message) => {
  if(message.guild) {
    let conf = JSON.parse(fs.readFileSync("./storage/config.json", "utf8"));

    if (!conf[message.guild.id])
      conf[message.guild.id] = {}
  
    if (!conf[message.guild.id].antispam)
      conf[message.guild.id].antispam = false;
  
    if (conf[message.guild.id].antispam == true) {
      antiSpam.message(message)
    }
  }
});

client.commands = Commands;
client.aliases = Aliases;

client.login(config.token);