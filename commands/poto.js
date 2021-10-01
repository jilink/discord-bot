import Game from "../classes/game";
import { getAuthorTagByMessage } from "../helper";

const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  isMessageComponentDMInteraction,
} = require("discord-api-types/utils/v9");
const { clientId, guildId, token } = require("../config.json");
let mots = ["1"];
const map = new Map();
var mot1 = "";
module.exports = {
  data: new SlashCommandBuilder()
    .setName("poto")
    .setDescription("Lance le jeu du traitre"),
  async execute(interaction, client) {
    const message = await interaction.reply({
      //Lance le jeu et le bot
      content: "Qui veut jouer ?",
      fetchReply: true,
    });
    const ids = new Set();
    message.react("👍").then(() => message.react("🚫")); //rajoute les réactions pour savoir qui veut jouer

    try {
      const filter = (reaction, user) => {
        //console.log(user);
        return (
          ["👍", "🚫"].includes(reaction.emoji.name) && user.id != clientId //filtre qui veut jouer ou non
        );
      };
      const collector = message.createReactionCollector({
        filter,
        time: 5000,
        min: 1,
        dispose: true,
      });
      collector.on("collect", (reaction, user) => {
        if (reaction.emoji.name === "🚫" && user.id === interaction.user.id) {
          //ajouter l'id de l'auteur pour bloquer les autres
          message.edit("Le jeu a été arrêté par son auteur");
          return false;
        }
        ids.add(user.id);
        let jsp = undefined; // conteneur de l'ensemble des id pour chaque clés
        if (map.get(reaction.emoji.name) != undefined) {
          jsp = Array.from([])
            .concat(map.get(reaction.emoji.name))
            .concat(user.id); //si la clé est déjà associée
        } else {
          jsp = Array(user.id);
        }
        map.set(reaction.emoji.name, jsp);
        console.log(`Reaction collected from ${reaction.emoji.name}, ${user}`);
      });

      collector.on("remove", (reaction, user) => {
        // enlève une réaction du vecteur en cas de retrait de réaction
        console.log("remove reaction");
        ids.delete(user.id);
        let jsp = undefined; // conteneur de l'ensemble des id pour chaque clés
        const tmp = map.get(reaction.emoji.name);
        tmp.splice(tmp.indexOf(user.id), 1);
        console.log(`Reaction removed from ${reaction.emoji.name}, ${user}`);
      });

      collector.on("end", (collected, reason) => {
        if (map.get("👍") === undefined || map.get("👍").length === 0) {
          // vérifie qu'au moins une personne a voté pour jouer, sinon le jeu se termine
          message.edit("Personne ne veut jouer");
          return false;
        }
        // DES GENS VEULENT BIEN JOUER

        let players = Array.from(ids);
        message.edit("Début du jeu");
        message.reactions
          .removeAll()
          .catch((error) =>
            console.error("Erreur lors de la prise de réactions", error)
          );
        map.clear();

        const traitorGame = new Game(players, client, interaction) // intialisation du jeu et des rôles
      });
    } catch (error) {
      console.log(error);
      message.reply(`Personne n'a voulu jouer`);
    }
  },
};