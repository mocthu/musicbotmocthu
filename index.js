const Discord = require("discord.js")
const dotenv = require("dotenv")
const { REST } = require("@discordjs/rest")
const { Routes} = require("discord-api-types/v9")
const fs = require("fs")
const { Player } = require("discord-player")



dotenv.config()
const TOKEN = process.env.TOKEN

const LOAD_SLASH = process.argv[2] == "load"

const CLIENT_ID = "953354147057520670"
const GUILD_ID = "940578314656022598"

const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_VOICE_STATES"
    ]
})

client.slashcommands = new Discord.Collection()
client.player = new Player(client, {
    ytdOptions: {
        quality: "highestaudio",
        highWatermark: 1 << 25
    }
})

let commands = []

const slashFiles = fs.readdirSync("./slash").filter(file => file.endsWith(".js"))
for (const file of slashFiles){
    const slashcmd = require(`./slash/${file}`)
    client.slashcommands.set(slashcmd.data.name, slashcmd)
    if (LOAD_SLASH) commands.push(slashcmd.data.toJSON())
}

if (LOAD_SLASH) {
    const rest = new REST({ version: "9"}).setToken(TOKEN)
    console.log("Deploying slash commands")
    rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
    .then(() => {
        console.log("Successfully loaded")
        process.exit(0)
    })
    .catch((err) => {
        if (err){
            console.log(err)
            process.exit(1)
        }
    })
}
else {
    client.on("ready", () => {
        console.log(`logged in as ${client.user.tag}`)
    })
    client.on("interactionCreate", (interaction) => {
        async function handleCommand() {
            if (!interaction.isCommand()) return

            const slashcmd = client.slashcommands.get(interaction.commandName)
            if (!slashcmd) interaction.reply("Not a valid slash command")

            await interaction.deferReply()
            await slashcmd.run({ client, interaction })
        }
        handleCommand()
    })
    client.login(TOKEN)
}



import express from "express";
import herokuAwake from "heroku-awake";
import { Client } from "discord.js";
import play from "./actions/play";
import skip from "./actions/skip";
import nowplaying from "./actions/nowplaying";
import pause from "./actions/pause";
import resume from "./actions/resume";
import stop from "./actions/stop";
import clear from "./actions/clear";

const port = process.env.PORT || 3000;
const server = express();
const url = ""; // Đường dẫn của app bạn trên Heroku

const bot = (): void => {
const client = new Client();
const token = process.env.TOKEN;

client.on("message", (message) => {
  const args = message.content.substring(prefix.length).split(" ");
  const content = message.content.substring(prefix.length + args[0].length);

  if (message.content[0] === "!") {
    switch (args[0]) {
      case play.name:
        play.execute(message, content);
        break;
      case skip.name:
        skip.execute(message);
        break;
      case nowplaying.name.toString():
        nowplaying.execute(message);
        break;
      case pause.name:
        pause.execute(message);
        break;
      case resume.name:
        resume.execute(message);
        break;
      case stop.name:
        stop.execute(message);
        break;
      case clear.name:
        clear.execute(message);
        break;
      // More short command
      case "np":
        nowplaying.execute(message);
        break;
      case "fs":
        skip.execute(message);
        break;
    }
  }
});

client.on("ready", () => {
  console.log("🏃‍♀️ Misabot is online! 💨");
});

client.once("reconnecting", () => {
  console.log("🔗 Reconnecting!");
});

client.once("disconnect", () => {
  console.log("🛑 Disconnect!");
});

  client.login(token);
};

server.disable('x-powered-by');

server.listen(port, () => {
bot();
herokuAwake(url);
console.log(`🚀 Server is running on port ${port} ✨`);
});
