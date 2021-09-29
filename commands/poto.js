const { SlashCommandBuilder } = require('@discordjs/builders');
const { isMessageComponentDMInteraction } = require('discord-api-types/utils/v9');
const { clientId, guildId, token } = require('../config.json');
let mots = ['chocolat', 'café', 'eau', 'voiture'];
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
      });
      collector.on("collect", (reaction, user) => {
        ids.add(user.id);
        console.log(`Reaction collected from ${reaction.emoji.name}, ${user}`);
      });

      collector.on("end", (collected, reason) => {
        //console.log(ids);
        let array = Array.from(ids);
        //console.log(array);
        message.edit("Début du jeu");
				console.log("users", message.reactions.cache.get('👍').users)
        message.reactions
          .removeAll()
          .catch((error) =>
            console.error("Erreur lors de la prise de réactions", error)
          );
        //console.log( `tableau est  ${tab[0]}`);
        const maitre = array[Math.floor(Math.random() * array.length)];
        const traitre = array[Math.floor(Math.random() * array.length)];
        const mot1 = mots[Math.floor(Math.random() * mots.length)];
        maitre &&
          client.users.cache
            .get(maitre)
            .send(`Vous êtes le maître. Le mot est : ${mot1}`);
        traitre &&
          client.users.cache
            .get(traitre)
            .send(`Vous êtes le traître. Le mot est : ${mot1}`);
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
