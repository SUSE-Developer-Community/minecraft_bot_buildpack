/*
CEO Bot (Standalone)
Adds new bots to their respective teams upon joining the server
 */
const mineflayer = require('mineflayer');
const wrapper = require('./wrapper.js')(bot)
const Vec3 = require('vec3')
const navigatePlugin = require('mineflayer-navigate')(mineflayer);
const host = 'localhost';
const port = 25565;
const username = "Lewis_Pugh"
const spawn = [-384, 64, -384]
const chatInterval = 63300;

let phraseIndex = 0
const orderedPhrases = true;
const phrases = ["Just keep swimming!  Just keep swimming!",
    "Thanks for helping save the planet!",
    "Say 'hi' to Geeko for me if you see him.",
    "You're a lean, green, planting machine!",
    "It's like this ocean goes on forever...",
    "Water water everywhere, but not a drop to drink.",
    "Row, row, row, your... self gently down the..."]

let waypointIndex = 0;
// const waypoints = [[-384,512],[512,512],[512,-384],[-384,-384]]
const waypoints = [new Vec3(-384, 64, 512), new Vec3(512, 64, 512), new Vec3(512, 64, -384), new Vec3(-384, 64, -384)]
let teamName = null;

var bot = mineflayer.createBot({
    username,
    host,
    port,
    version: false
})

// Install the navigate plugin
navigatePlugin(bot);

bot.on('error', err => console.log(err))
bot.on('respawn', () => {
    console.log('respawn')
})

// Sample usage
console.log(`${username}| Initializing`)

// at set interval, chat random Geeko phrase
setInterval(() => {
    if (orderedPhrases) {
        bot.chat(phrases[phraseIndex++ % phrases.length])
    } else {
        phraseIndex = Math.floor(Math.random() * phrases.length)
    }
}, chatInterval)

// Teleport to Geeko hideout
bot.on('login', () => {
    console.log(`${username}| Login: Teleporting to ocean`)
    bot.chat(`/tp ${spawn[0]} ${spawn[1]} ${spawn[2]}`)

    // TODO: Swim to waypoints
    setInterval(() => {
        let waypoint = waypoints[waypointIndex++ % waypoints.length]
        bot.chat(`/tp ${waypoint.x} ${waypoint.y} ${waypoint.z}`)
        // bot.navigate.to(target.position);
    }, 5000)
})
// bot.navigate.on('pathFound', function (path) {
//     bot.chat(`found path to ${waypoints[2]}. I can get there in ${path.length} moves.`);
// });
// bot.navigate.on('cannotFind', function (closestPath) {
//     bot.chat("unable to find path. getting as close as possible");
//     bot.navigate.walk(closestPath);
// });
// bot.navigate.on('arrived', function () {
//     bot.chat("Checkpoint!");
//     bot.navigate.to(waypoints[waypointIndex++]);
// });
// bot.navigate.on('interrupted', function() {
//     bot.chat("stopping");
// });

        