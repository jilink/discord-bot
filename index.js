require("dotenv").config(); //initialize dotenv
const Discord = require("discord.js"); //import discord.js

const client = new Discord.Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
}); //create new client
const jimmy_uid = "378990039109206017";
const quiz_channelId = "852249134282178600";
const jimmy_channelId = "827083866749665280";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  // client.users.cache.find(user => user.id === my_uid)
});

client.on("message", (msg) => {
  console.log("message", msg.channelId, "me", jimmy_channelId);
  if (jimmy_channelId === msg.channelId) {
    const is_simple_poll = msg.author.id == "324631108731928587";
    const author_tag = `<@${msg.author.id}>`;
    if (is_simple_poll) {
      msg.reply(
        "wesh y a un sondage @here ceux qui répondent pas leurs noms sont ajoutés et ils seront ban dans moins de 24h (pas une blague)"
      );
    }
    if (msg.author.bot) return;
    const msg_lower = msg.content.toLowerCase();
    if (msg_lower.includes("pierre")) {
      msg.reply(
        "Les gars vous parlez de pierre ? cest un génie ce mec, regardez : Pierre, 2 + 2 = ?"
      );
    }
  }
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'react') {
		const message = await interaction.reply({ content: 'You can react with Unicode emojis!', fetchReply: true });
		message.react('😄');
	}
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
