module.exports = async client => {
  console.log(`//---Bot loaded on ${client.guilds.cache.size} guild(s) with ${client.users.cache.size} member(s) in total.---//`);

  client.user.setActivity(client.config.activity, { type: client.config.activityType });
}