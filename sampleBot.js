/*
Finds a resource chest
Retrieves grass, saplings, bonemeal
finds a place to lay grass
plants a sapling
fertalizes sapling until growth (or out of bonemeal)
finds a place to plan until out of saplings
finds a place to lay grass until out of saplings or grass
 */
let state = {
    init: false,
}; // persistant

// Set Unique team name only A-Z and _  (no -'s)
// This is how your points will be counted
module.exports.team = 'TeamJeff'

// TODO from here down is the user's code
module.exports.loop = ({bot}, wrapper) => {
  // wrapper.findNearestGrass()

    // let mcData
    // bot.on('inject_allowed', () => {
    //     mcData = require('minecraft-data')(bot.version)
    // })
    

    // Sample usage
    if(state.init == false) {
        console.log('Initializing bot')

        // optional configuration
        // mcData.blocksByName.farmland.id;
        bot.navigate.blocksToAvoid[132] = true; // avoid tripwire
        bot.navigate.blocksToAvoid[59] = false; // ok to trample crops
        bot.navigate.on('pathFound', function (path) {
            bot.chat("found path. I can get there in " + path.length + " moves.");
        });
        bot.navigate.on('cannotFind', function (closestPath) {
            bot.chat("unable to find path. getting as close as possible");
            bot.navigate.walk(closestPath);
        });
        bot.navigate.on('arrived', function () {
            bot.chat("I have arrived");
        });
        bot.navigate.on('interrupted', function() {
            bot.chat("stopping");
        });
        bot.on('chat', function(chatuser, message) {
            // navigate to whoever talks
            console.log('Speaker: ' + chatuser + ', bot username:' + bot.username)
            if (chatuser === bot.username) return;
            console.log(chatuser + ' said: ' + message)
            console.log(bot.players[chatuser]);
            if (message === 'come') {
                state.target = bot.players[chatuser].entity;
                if(state.target) {
                    bot.navigate.to(state.target.position);
                }
            } else if (message === 'stop') {
                bot.navigate.stop();
            }
        });
        
    }
    state.init = true;

}