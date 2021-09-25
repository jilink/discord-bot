require('dotenv').config(); //initialize dotenv
const Discord = require('discord.js'); //import discord.js


const client = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGES']}); //create new client
const my_uid = '378990039109206017'

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
	// client.users.cache.find(user => user.id === my_uid)
});


client.on('message', msg => {
	const is_simple_poll = msg.author.id == '324631108731928587'
	const author_tag = `<@${msg.author.id}>`
	if (is_simple_poll) {
		msg.reply('wesh y a un sondage @here ceux qui répondent pas leurs noms sont ajoutés et ils seront ban dans moins de 24h (pas une blague)')
	}
	console.log(msg.author)
	if(msg.author.bot) return;
	const msg_lower = msg.content.toLowerCase();
	if (msg_lower.includes('pierre')) {
		msg.reply('Les gars vous parlez de pierre ? cest un génie ce mec, regardez : Pierre, 2 + 2 = ?');
	}
	if (msg_lower.includes('alex')) {
		msg.reply('Parlez pas d\'alex sauf pour en dire du bien svp');
	}
	if (msg_lower.includes('jimmy')) {
		msg.reply('stop parler dans mon dos');
	}
	if (msg_lower.includes('java')) {
		msg.reply('java ... Le moteur de recherche ?');
	}
	if (msg_lower.includes('tg')) {
		msg.reply(`${author_tag} toi tg`);
	}
	if (msg_lower.includes('casino')) {
		msg.reply('Total des sous perdus au casino par Jimmy : 90€');
		msg.reply('Total des sous gagnés au casino par Wass : <erreur le maximum pour un nombre entier a été dépassé>');
	}
	if (msg_lower.includes('dictature') || msg_lower.includes('dictateur')) {
		msg.reply(`${author_tag} stop de parler de dictature, c'est pas une dictature, répète après moi ou je te mets en prison`);
	}
	if (msg_lower.includes('monstre') || msg_lower.includes('chiant')) {
		msg.reply(`${author_tag} c'est vrai`);
	}
});


//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
