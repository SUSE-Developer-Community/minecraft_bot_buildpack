/* Test harness for running a bot script locally without CAP requirements */
const Vec3 = require('vec3')
const mineflayer = require('mineflayer');
// var blockFinderPlugin = require('mineflayer-blockfinder')(mineflayer);
const navigatePlugin = require('mineflayer-navigate')(mineflayer);
const uuidv4 = require('uuid/v4');
const uuid = uuidv4().split('-')[0];
const host = 'localhost';
const port = 25565;

if (process.argv.length < 3 || process.argv.length > 4) {
    console.log('Usage : node localApp.js <script name>]')
    process.exit(1)
}
const script = process.argv[2];
username = script;
username += `_${uuid}`;
username = username.substr(0, 16); // trim to 16 characters, minecraft limit

let bot = mineflayer.createBot({
    username,
    host,
    port,
    version: "1.12.2"
})
console.log("Bot.majorVersion ================= " + bot.majorVersion)

bot.on('error', err => console.log(err))
bot.on('respawn', () => {
    console.log('respawn')
})

let mcData = require('minecraft-data')("1.12")
console.log('mcData postinject: ' + mcData)

// Install the blockFinder plugin
// bot.loadPlugin(blockFinderPlugin);
// Install the navigate plugin
navigatePlugin(bot);

const playerBot = require('./' + script + '.js')
const wrapper = require('./wrapper.js')(bot)

// Announce Team to Geeko Bot (Geeko sets teams and provides starting inventory.)
bot.once('login', function () {
    console.log(bot.username + "| playerBot: " + playerBot)
    console.log(bot.username + "| Login")
    console.log(bot.username + `| ${wrapper.TEAM_PREFIX}${playerBot.team}${wrapper.TEAM_SUFFIX}`)
    bot.chat(`${wrapper.TEAM_PREFIX}${playerBot.team}${wrapper.TEAM_SUFFIX}`)
    
    // TODO: is it possible to add the bot, wrapper, etc to the playerBot scope
    //  so they can be used in player defined functions?
    // playerBot.bot = bot;
    // playerBot.wrapper = wrapper;
    
    playerBot.init({bot}, wrapper, {mcData}, {Vec3});
    setInterval(() => {
        playerBot.loop({
            bot,
            getPlayers: bot.findPlayers
        }, wrapper, {mcData}, {Vec3})
    }, 3000)
})
