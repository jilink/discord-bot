const { clientId, guildId, token } = require("../config.json");
import { getAuthorTagById, getAuthorTagByMessage } from "../helper";

// variable globale
const mots = ["1"];
const PLAYER_TYPES = {
  PLAYER: "PLAYER",
  MAITRE: "MASTER",
  TRAITRE: "TRAITOR",
};
class Game {
  constructor(players, client, interaction) {
    this.players = players;
    this.client = client;
    this.interaction = interaction;
    this.maitreIndex = Math.floor(Math.random() * this.players.length)
    this.maitre = this.players[this.maitreIndex];
    this.traitreListe = this.players.slice();
    this.traitreListe.splice(this.maitreIndex,1);
    console.log("Liste de joueurs",this.players);
    console.log("Nom du maitre", this.maitre);
    console.log("Liste de traitre",this.traitreListe);
    this.traitre =
      this.traitreListe[Math.floor(Math.random() * this.traitreListe.length)];

    this.init();
  }

  init(turnCount = 0) {
    this.turnCount = turnCount + 1;
    this.mot = mots[Math.floor(Math.random() * mots.length)];

    this.sendWordToUser(this.maitre, PLAYER_TYPES.MAITRE);
    this.sendWordToUser(this.traitre);

    const filter2 = (m) => m.content.includes(this.mot);
    const collectormessage = this.interaction.channel.createMessageCollector({
      filter2,
      time: 30000,
    });

    //collect les réponses
    collectormessage.on("collect", (m) => {
      if (m.content.includes(this.mot)) {
        // je préfère includes au cas ou le mot est dans une phrase ou mal écrit
        collectormessage.stop();
        this.wordFound(m);
        return false;
      }
    });

    collectormessage.on("end", (m, reason) => {
      if (reason === "time") {
        this.interaction.channel.send("Perdu le temps est écoulé");
        return false;
      }
    });
  }

  sendWordToUser(user, type = PLAYER_TYPES.TRAITRE) {
    // si le type est pas passé en param ça prend traitre auto
    let text;
    if (type === PLAYER_TYPES.TRAITRE) {
      text = "Vous êtes le traitre ! Le mot est : ";
    } else if (type === PLAYER_TYPES.MAITRE) {
      text =
        "Vous êtes le maitre du jeu, répondez aux questions ! Le mot est : ";
    } else {
      // si c'est aucun de ces deux types c'est pas bon on stop la fonction ici
      return;
    }
    user && this.client.users.cache.get(user).send(`${text}${this.mot}`);
  }

  //crée le poll pour choisir si c'est un traitre ou non
  async wordFound(messageToReply) {
    const author_tag = getAuthorTagByMessage(messageToReply);
    let message = await messageToReply.reply({
      content: `${author_tag} Vous avez trouvé le mot, maintenant votez si c'est le traitre ou non `,
      fetchReply: true,
    });
    message.react("👍").then(() => message.react("👎"));
    let map = new Map();
    const filter = (reaction, user) => {
      return (
        ["👍", "👎"].includes(reaction.emoji.name) && user.id != clientId //on ne récupère que les pouces des joueurs à ajouter
      );
    };
    const collector = message.createReactionCollector({
      filter,
      time: 5000,
      min: 1,
      dispose: false,
    });
    collector.on("collect", (reaction, user) => {
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
    collector.on("end", () => {
      const pour = new Set(map.get("👍")).size;
      const contre = new Set(map.get("👎")).size;
      const isAccused = pour > contre ? true : false;
      this.turnEnds(messageToReply, isAccused);
      console.log(pour, contre, messageToReply.author.id);
    });
    map.clear();
  }

  turnEnds(winnerMessage, isAccused) {
    const channel = winnerMessage.channel;
    if (isAccused && this.isTraitorMessage(winnerMessage)) {
      channel.send("Les citoyens ont gagné, c'était bien le traitre !");
      return true;
    } else if (isAccused) {
      if (this.turnCount > 1) {
        channel.send(
          `ok j'abandone vous êtes vraiment trop nul le traitre c'était ${getAuthorTagById(
            this.traitre
          )}`
        );
        return false;
      }
      channel.send(
        "Ce n'était pas le traitre ! Allez on continue il faut le trouver ce con. NOUVEAU MOT!"
      );
      this.init(this.turnCount);
      return true;
    } else {
      channel.send(
        "Mais si c'était le traitre !! Bravo tu as gagné sale traitre ..."
      );
    }
    return false;
  }

  isTraitorMessage(message) {
    return message.author.id === this.traitre;
  }
}

export default Game;
