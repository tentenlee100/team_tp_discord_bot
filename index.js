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

let eat = fs.readFileSync( path.resolve(__dirname, 'eat.json'));
let eatJson = JSON.parse(eat);

client.on('message', msg => {
  if (msg.content.toLowerCase() === '!dd') {
    if (!ddListSnapshot) {
      listenDdListSnapshot()
    }
    const ddObj = ddArray[getRandomInt(ddArray.length)]
    let ddMessage = ddObj.message.replace("\\n", "\n")
    const embed = new Discord.MessageEmbed()
      // Set the title of the field
      // .setTitle('A slick little embed')
      // Set the color of the embed
      // .setColor(0xFF0000)
      // Set the main content of the embed
      .setDescription(ddMessage)
      .setThumbnail('https://akb48-tp.tenten.tw/images/member/' + ddObj.key + '.png')
    // Send the embed to the same channel as the message


    msg.channel.send(embed);
  }
  if (msg.content.toLowerCase() === '亂源') {
    if (getRandomInt(100) === 0) {
      msg.channel.send(msg.author.toString() + "  你就是亂源");
    } else {
      const ddMessage = sourceNameArray[getRandomInt(sourceNameArray.length)]
      msg.channel.send(ddMessage + " 就是亂源");
    }
  }
  if (msg.content.indexOf("嗯?") === 0 || msg.content.indexOf("嗯？") === 0) {
    if (!thinkingListSnapshot) {
      listenThinkingSnapshot()
    }
    const thinking = thinkingArray[getRandomInt(thinkingArray.length)]
    const embed = new Discord.MessageEmbed()
      .setTitle(thinking.name)
      .setImage(thinking.url)


    msg.channel.send(embed);
  }
  
  if (msg.content.indexOf("!修但") === 0) {
    const thinking = waitJson[getRandomInt(waitJson.length)]
    msg.channel.send(thinking);
  }
  if (msg.content.indexOf("!餵食") === 0) {
    const thinking = eatJson[getRandomInt(eatJson.length)]
    msg.channel.send(thinking);
  }
  if (msg.content.indexOf("金欠") > -1) {
      msg.react('🤔')
  }
});

client.login(config.discordBotKey);