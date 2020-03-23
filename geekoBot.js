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
const chatInterval = 30*1000;

var phraseIndex =0
const phrases = ["Good luck!",
    "Thanks for saving my forest!",
    "Say hi to Lewis for me if you see him.",
    "Watch out for those creepers!",
    "Bone meal can be used on saplings for a chance to grow faster.",
    "You can craft bonemeal from bones.",
    "You can get bones by defeating skeletons."]

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
    bot.chat(`/gamemode 1`)
    bot.chat(`/tp ${spawn[0]} ${spawn[1]} ${spawn[2]}`)
})

// at set interval, chat random Geeko phrase
setInterval(()=>{
    // uncomment for random phrases
    // phraseIndex = Math.floor(Math.random() * phrases.length)
    bot.chat(phrases[phraseIndex++%phrases.length])
},chatInterval)

function addSpeakerToTeam(chatuser, message) {
    // parse chat for team
    console.log('Geeko|Parse for team')
    var end = message.length - wrapper.TEAM_SUFFIX.length;
    teamName = message.substring(wrapper.TEAM_PREFIX.length, end);
    console.log(`Found [${teamName}]`)

    // test for team? - No easy way to test without waiting for chat response

    // make team
    console.log('Geeko|Make team')
    bot.chat(`/scoreboard teams add ${teamName}`)

    // set random color?
    console.log('Geeko|Random Color team?')
    var colorIndex = Math.floor(Math.random() * wrapper.colors.length - 1);
    var color = colorIndex < wrapper.colors.length ? wrapper.colors[colorIndex] : wrapper.colors[0]
    bot.chat(`/scoreboard teams option ${teamName} color ${color}`)

    // join player to team
    console.log('Geeko|Join team')
    bot.chat(`/scoreboard teams join ${teamName} ${chatuser}`)
}

function giveBlocks(chatuser) {
    bot.chat(`/give @p[name=${chatuser}] grass 64 0 {CanPlaceOn:[sand,sandstone]}`)
    bot.chat(`/give @p[name=${chatuser}] sapling 64 3 {CanPlaceOn:[grass]}`)
    bot.chat(`/give @p[name=${chatuser}] dye 64 15 {CanPlaceOn:["sapling"]}`)
    bot.chat(`/give @p[name=${chatuser}] torch 64 0 {CanPlaceOn:["log",grass,dirt,sand,sandstone]}`)
    bot.chat(`/gamemode 1 @p[name=${chatuser}]`) // set player to Survival mode
}



bot.on('chat', function(chatuser, message) {
    // console.log('Geeko|Speaker: ' + chatuser + ', bot username:' + bot.username + '\nmsg: ' + message)
    // Ignore messages from this bot
    if (chatuser === bot.username) return;

    // console.log('Geeko|Checking if chat contains ' + wrapper.TEAM_PREFIX + '___' + wrapper.TEAM_SUFFIX)

    if (message.includes(wrapper.TEAM_PREFIX)) {
        addSpeakerToTeam(chatuser, message);
        giveBlocks(chatuser);
    } else if (message === wrapper.RESUPPLY_MSG) {
        giveBlocks(chatuser);
    }
})


        