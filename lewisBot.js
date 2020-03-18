/*
CEO Bot (Standalone)
Adds new bots to their respective teams upon joining the server
 */
var mineflayer = require('mineflayer');
const wrapper = require('./wrapper.js')(bot)
const navigatePlugin = require('mineflayer-navigate')(mineflayer);
const host = 'localhost';
const port = 25565;
const username = "Lewis_Pugh"
const spawn = [-384,64,-384]
const chatInterval = 33300;

var phraseIndex = 0
const phrases = ["Just keep swimming!  Just keep swimming!",
    "Thanks for helping save the planet!",
    "Say 'hi' to Geeko for me if you see him.",
    "You're a lean, green, planting machine!",
    "It's like this ocean goes on forever...",
    "Water water everywhere, but not a drop to drink.",
    "Row row row your... self gently down the..."]

var waypointIndex = 0;
const waypoints = [[-384,512],[512,512],[512,-384],[-384,-384]]
var teamName = null;

var bot = mineflayer.createBot({
    username,
    host,
    port,
    version: false
})

bot.on('error', err => console.log(err))
bot.on('respawn',()=>{console.log('respawn')})

// Sample usage
console.log(`${username}| Initializing`)

// at set interval, chat random Geeko phrase
setInterval(()=>{
    // uncomment for random phrases
    // phraseIndex = Math.floor(Math.random() * phrases.length)
    bot.chat(phrases[phraseIndex++%phrases.length])
},chatInterval)

// TODO: Teleport to water and start swimming
// Teleport to Geeko hideout
bot.on('login',() => {
    console.log(`${username}| Login: Teleporting to ocean`)
    bot.chat(`/tp ${spawn[0]} ${spawn[1]} ${spawn[2]}`)
})
// bot.navigate.on('pathFound', function (path) {
//     bot.chat(`found path to ${waypoints[waypointIndex]}. I can get there in ${path.length} moves.`);
// });
// bot.navigate.on('cannotFind', function (closestPath) {
//     bot.chat("unable to find path. getting as close as possible");
//     bot.navigate.walk(closestPath);
// });
// bot.navigate.on('arrived', function () {
//     bot.chat("I have arrived");
// });
// bot.navigate.on('interrupted', function() {
//     bot.chat("stopping");
// });
function addSpeakerToTeam(chatuser, message) {
    // parse chat for team
    console.log('Lewis|Parse for team')
    var end = message.length - wrapper.TEAM_SUFFIX.length;
    teamName = message.substring(wrapper.TEAM_PREFIX.length, end);
    console.log(`Found [${teamName}]`)

    // test for team? - No easy way to test without waiting for chat response

    // make team
    console.log('Lewis|Make team')
    bot.chat(`/scoreboard teams add ${teamName}`)

    // set random color?
    console.log('Lewis|Random Color team?')
    var colorIndex = Math.floor(Math.random() * wrapper.colors.length - 1);
    var color = colorIndex < wrapper.colors.length ? wrapper.colors[colorIndex] : wrapper.colors[0]
    bot.chat(`/scoreboard teams option ${teamName} color ${color}`)

    // join player to team
    console.log('Lewis|Join team')
    bot.chat(`/scoreboard teams join ${teamName} ${chatuser}`)
}

function giveBlocks(chatuser) {
    bot.chat(`/give @p[name=${chatuser}] grass 64 0 {CanPlaceOn:[sand,sandstone]}`)
    bot.chat(`/give @p[name=${chatuser}] sapling 64 3 {CanPlaceOn:[grass]}`)
    bot.chat(`/give @p[name=${chatuser}] dye 64 15 {CanPlaceOn:["sapling"]}`)
    bot.chat(`/give @p[name=${chatuser}] torch 64 0 {CanPlaceOn:["log",grass,dirt,sand,sandstone]}`)
}



bot.on('chat', function(chatuser, message) {
    // console.log('Lewis|Speaker: ' + chatuser + ', bot username:' + bot.username + '\nmsg: ' + message)
    // Ignore messages from this bot
    if (chatuser === bot.username) return;

    // console.log('Lewis|Checking if chat contains ' + wrapper.TEAM_PREFIX + '___' + wrapper.TEAM_SUFFIX)

    if (message.includes(wrapper.TEAM_PREFIX)) {
        addSpeakerToTeam(chatuser, message);
        giveBlocks(chatuser);
    } else if (message === wrapper.RESUPPLY_MSG) {
        giveBlocks(chatuser);
    }
});

        