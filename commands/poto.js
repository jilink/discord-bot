const { SlashCommandBuilder } = require('@discordjs/builders');
const { isMessageComponentDMInteraction } = require('discord-api-types/utils/v9');
const { clientId, guildId, token } = require('../config.json');
let mots = ['chocolat'];
const map = new Map();
var mot1 = ""; 
module.exports = {
  data: new SlashCommandBuilder()
    .setName("poto")
    .setDescription("Lance le jeu du traitre"),
  async execute(interaction, client) {
    const message = await interaction.reply({
      content: "Qui veut jouer ?",
      fetchReply: true,
    });
    const ids = new Set();
    message.react("👍").then(() => message.react("🚫"));

    try {
      const filter = (reaction, user) => {
        //console.log(user);
        return (
          ["👍", "🚫"].includes(reaction.emoji.name) && user.id != clientId
        );
      };
      const collector = message.createReactionCollector({
        filter,
        time: 5000,
        min: 1,
		dispose: true,
      });
      collector.on("collect", (reaction, user) => {
		if(reaction.emoji.name ==='🚫' && user.id === interaction.user.id){ //ajouter l'id de l'auteur pour bloquer les autres 
			message.edit('Le jeu a été arrêté par son auteur');
			return false;
		}
		ids.add(user.id);
		let jsp = undefined; // conteneur de l'ensemble des id pour chaque clés
		if(map.get(reaction.emoji.name) != undefined){
			jsp = Array.from([]).concat(map.get(reaction.emoji.name)).concat(user.id) //si la clé est déjà associée
		}
		else {
			jsp = Array(user.id)
		}
		map.set(reaction.emoji.name, jsp);
        console.log(`Reaction collected from ${reaction.emoji.name}, ${user}`);
      });

	  collector.on("remove", (reaction, user) => { // enlève une réaction du vecteur en cas de retrait de réaction
		console.log("remove reaction");
		ids.delete(user.id);
		let jsp = undefined; // conteneur de l'ensemble des id pour chaque clés
		const tmp = map.get(reaction.emoji.name);
		tmp.splice(tmp.indexOf(user.id), 1);
        console.log(`Reaction removed from ${reaction.emoji.name}, ${user}`);
      });


      collector.on("end", (collected, reason) => {
		if(map.get("👍") === undefined || map.get("👍").length === 0 ) { // vérifie qu'au moins une personne a voté pour jouer, sinon le jeu se termine
			message.edit("Personne ne veut jouer");
			return false;
		}
		
		let array = Array.from(ids);
        message.edit("Début du jeu");
        message.reactions
          .removeAll()
          .catch((error) =>
            console.error("Erreur lors de la prise de réactions", error)
          );
        //console.log( `tableau est  ${tab[0]}`);
        const maitre = array[Math.floor(Math.random() * array.length)];
        const traitre = array[Math.floor(Math.random() * array.length)];
        mot1 = mots[Math.floor(Math.random() * mots.length)];
        console.log(mot1);
		maitre &&
          client.users.cache
            .get(maitre)
            .send(`Vous êtes le maître. Le mot est : ${mot1}`);
        traitre &&
          client.users.cache
            .get(traitre)
            .send(`Vous êtes le traître. Le mot est : ${mot1}`);
			map.clear();
      });
	  const filter2 = m => m.content.includes(mot1);
	  const collectormessage = interaction.channel.createMessageCollector({filter2});
	  //let mrep = undefined;	 
	  collectormessage.on('collect', m => {
		if(m.content === mot1)  
			m.reply({content : 'Vous avez trouvé le mot', fetchReply: true})
			m.react("👍").then(() => m.react("🚫"));
		});
    } catch (error) {
      console.log(error);
      message.reply(`Personne n'a voulu jouer`);
    }

    /*message.awaitReactions({filter, max: 10, time: 5000})
			.then(collected => {
				const reaction = collected.first();
				const user = colle;
				console.log(user);
				const channel = interaction.channel	
				if (reaction.emoji.name === '👍'){
					
					message.edit('J ai changé d avis');
					message.reactions.removeAll()
						.catch(error => console.error('Erreur lors de la suppression de réactions', error));	

				}
				else if (reaction.emoji.name === '🚫'){
					
					message.reply('Fin');
				}

			})
			.catch(collected => {
				message.reply("Ouille");


			});
*/
  },
};
