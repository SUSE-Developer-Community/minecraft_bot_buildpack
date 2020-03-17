/*
CEO Bot (Standalone)
Adds new bots to their respective teams upon joining the server
 */
var mineflayer = require('mineflayer');
const wrapper = require('./wrapper.js')(bot)
const host = 'localhost';
const port = 25565;
const username = "Geeko"
const spawn = [27,64,-110]
const chatInterval = 15000;
const phrases = ["Good luck!",
    "Thanks for saving my forest!",
    "Say hi to Lewis for me if you see him.",
    "Watch out for those creepers!",
    "Bone meal can be used on saplings for a chance to grow faster.",
    "You can get bones by defeating skeletons.",
    "You can craft bonemeal from bones."]

var bot = mineflayer.createBot({
    username,
    host,
    port,
    version: false
})

bot.on('error', err => console.log(err))
bot.on('respawn',()=>{console.log('respawn')})

console.log(`${username}|Initializing`)

// Teleport to Geeko hideout
bot.on('login',() => {
    console.log(`${username}| Login: Teleporting to geeko spawn`)
    bot.chat(`/tp ${spawn[0]} ${spawn[1]} ${spawn[2]}`)
})

// at set interval, chat random Geeko phrase
setInterval(()=>{
    var phraseIndex = Math.floor(Math.random() * phrases.length)
    bot.chat(phrases[phraseIndex])
},chatInterval)

//     bot.chat("found path. I can get there in " + path.length + " moves.");


        