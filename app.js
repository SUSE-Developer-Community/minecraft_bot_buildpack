var mineflayer = require('mineflayer');
const uuidv4 = require('uuid/v4');
const uuid = uuidv4().split('-')[0];
const username= `bot-${uuid}`;


// TODO split out VCAP stuff into helper package
const exitWithoutService = ()=>{
  console.error("Programs using this buildpack require a user-provided service: MinecraftServer")
  console.error("If you are using the SUSE CAP Sandbox, please add the binding using Stratos or `cf bind-service <your app name> MinecraftServer` ")
  process.exit(127)
}

const VCAP = process.env.VCAP_SERVICES
// Verifiy that server is passed in
if ( !VCAP['user-provided'] || VCAP['user-provided'].length<1 ) {
  exitWithoutService()
}

// Verifiy that server is passed in part two
const server_service = VCAP['user-provided'].find((svc)=>(svc.name==="MinecraftServer"))
if ( !server_service ) {
  exitWithoutService()
}

const { host, port} = server_service.credentials

var bot = mineflayer.createBot({
  username,
  host,
  port,
  version: false
})

bot.on('error', err => console.log(err))

bot.on('respawn',()=>{console.log('respawn')})

const func = require('./bot.js')
const wrapper = require('./wrapper.js')(bot)
setInterval(()=>{
  func({
    bot,
    getPlayers: bot.findPlayers
  }, wrapper, {}) // wrapper
},1000)