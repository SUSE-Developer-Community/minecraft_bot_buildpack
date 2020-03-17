/* Test harness for running a bot script locally without CAP requirements */

var mineflayer = require('mineflayer');
// var blockFinderPlugin = require('mineflayer-blockfinder')(mineflayer);
const navigatePlugin = require('mineflayer-navigate')(mineflayer);
const uuidv4 = require('uuid/v4');
const uuid = uuidv4().split('-')[0];
const host = 'localhost';
const port = 25565;

// console.log(process.argv.length)
// for (const argvElement of process.argv) {
//   console.log(argvElement);
// }

if (process.argv.length < 3 || process.argv.length > 4) {
  console.log('Usage : node localApp.js <script name>]')
  process.exit(1)
}
const script = process.argv[2];
username = script;
username += `_${uuid}`;
username = username.substr(0,16); // trim to 16 characters, minecraft limit

var bot = mineflayer.createBot({
  username,
  host,
  port,
  version: false
})

bot.on('error', err => console.log(err))
bot.on('respawn',()=>{console.log('respawn')})

// Install the blockFinder plugin
// bot.loadPlugin(blockFinderPlugin);
// Install the navigate plugin
navigatePlugin(bot);


const playerBot = require('./' + script + '.js')
const wrapper = require('./wrapper.js')(bot)


setInterval(()=>{
  playerBot.loop({
    bot,
    getPlayers: bot.findPlayers
  }, wrapper, {})
},1000)

// Announce Team to Lewis Bot
bot.once('login', function(){
  console.log(bot.username + "| playerBot: " + playerBot)
  console.log(bot.username + "| Login")
  console.log(bot.username + `| ${wrapper.TEAM_PREFIX}${playerBot.team}${wrapper.TEAM_SUFFIX}`)
  bot.chat(`${wrapper.TEAM_PREFIX}${playerBot.team}${wrapper.TEAM_SUFFIX}`)
})
