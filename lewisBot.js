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

var bot = mineflayer.createBot({
    username,
    host,
    port,
    version: false
})

bot.on('error', err => console.log(err))
bot.on('respawn',()=>{console.log('respawn')})

// Unique team name only A-Z and _  (no -'s)
let state = {
    init: false
}; // persistant


// Sample usage
console.log(`Initializing ${username}`)

// optional configuration

// TODO: Teleport to water and start swimming
// bot.navigate.blocksToAvoid[132] = true; // avoid tripwire
// bot.navigate.blocksToAvoid[59] = false; // ok to trample crops
// bot.navigate.on('pathFound', function (path) {
//     bot.chat("found path. I can get there in " + path.length + " moves.");
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
bot.on('chat', function(chatuser, message) {
    // console.log('Lewis|Speaker: ' + chatuser + ', bot username:' + bot.username + '\nmsg: ' + message)
    // Ignore messages from this bot
    if (chatuser === bot.username) return;

    console.log('Lewis|Checking if chat contains ' + wrapper.TEAM_PREFIX + '___' + wrapper.TEAM_SUFFIX)

    function addSpeakerToTeam() {
        // parse chat for team
        console.log('Lewis|Parse for team')
        var end = message.length - wrapper.TEAM_SUFFIX.length;
        var teamName = message.substring(wrapper.TEAM_PREFIX.length, end);
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

    if (message.includes(wrapper.TEAM_PREFIX)) {
        addSpeakerToTeam();
    }
});
        