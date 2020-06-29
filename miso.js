const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const path = require('path');
const config = require("./config")

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://akb48-tp.firebaseio.com",
});

var db = admin.firestore();

var ddListSnapshot = null
var thinkingListSnapshot = null
var ddArray = []
var thinkingArray = []

function listenDdListSnapshot() {
  var citiesRef = db.collection('discord_dd_list');
  ddListSnapshot = citiesRef.onSnapshot(docSnapshot => {
    ddArray = []
    docSnapshot.forEach(doc => {
      ddArray.push({ key: doc.id , ...doc.data()})
    })
    // ...

  }, err => {
    console.log(`Encountered error: ${err}`);
  });
}
function listenThinkingSnapshot() {
  var citiesRef = db.collection('discord_thinking_list');
  thinkingListSnapshot = citiesRef.onSnapshot(docSnapshot => {
    thinkingArray = []
    docSnapshot.forEach(doc => {
      thinkingArray.push(doc.data())
    })
    // ...

  }, err => {
    console.log(`Encountered error: ${err}`);
  });
}

listenDdListSnapshot()
listenThinkingSnapshot()

function getRandomInt(count) {
  return Math.floor(Math.random() * Math.floor(count));
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const sourceNameArray = ["R6", "miso", "miso", "信偉"]


let wait = fs.readFileSync( path.resolve(__dirname, 'wait.json'));
let waitJson = JSON.parse(wait);

client.on('message', msg => {
   console.log(msg.author.username);
   
  if (msg.author.username.indexOf('miso') > -1){
    ["🚓", "🚔", "🚑", "🚒", "🏎", "🚎", "🚌", "🚕", "🚘", "🚖", "🚄", "🚂"].forEach(emoji => {    
      msg.react(emoji)
    })
  }
});

client.login(config.discordBotKey);