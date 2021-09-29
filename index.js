require("dotenv").config(); //initialize dotenv
const fs = require('fs');
//const Discord = require("discord.js"); //import discord.js
const {Client, Collection ,Intents} = require('discord.js');
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials : ["CHANNEL"]
}); //create new client
const jimmy_uid = "378990039109206017";
const quiz_channelId = "852249134282178600";
const jimmy_channelId = "827083866749665280";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // client.users.cache.find(user => user.id === my_uid)
});


client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {

  const command = require(`./commands/${file}`);

  client.commands.set(command.data.name, command);

}
//console.log(client.commands)
/*client.on("messageCreate", message => {

  console.log(message);
  if (message.author.id == '430374755363979264') {
      message.reply("EUh");

  }

})*/

client.on('interactionCreate', async interaction => {

  //console.log(interaction);
  if(!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if(!command) return;

  try {
    await command.execute(interaction, client);
    console.log("here");

  } catch(error) {
    console.error(error);
    await interaction.reply({ content : 'Ther was an error while executing this command!'});
  }



});



//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
