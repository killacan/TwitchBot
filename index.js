const TMI = require('tmi.js');
const Brain = require('brain.js');

const BOT_NAME = "LlamaBot";
const TMI_OAUTH = "oauth:r6dxrdv90812ced9gy0w8b6dtti12e"
const TMI_OPTIONS = {
    identity: {
        username: BOT_NAME,
        password: TMI_OAUTH
    },
    channels: [
        "leisurellama"
    ]
}

const net = new brain.NeuralNetwork();

net.train([
    
])

const client = new TMI.client(TMI_OPTIONS);
client.on("connected", onConnectionHandler);
client.connect();
client.on("message", onMessageHandler);

let quotes = [];
let channelPoints = {};

function addQuote (quote) {
    quotes.push(quote);
}

function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

function onMessageHandler(target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    let trimmedMsg = msg.trim();
    let splitMsg = trimmedMsg.split(" ");

    let funnyResponses = [
        "That is a funny looking outfit you have there. Did you get it from the clown store?",
        "I didn't know it was possible to be that bad a video games. Kudos to you for achieving the impossible!",
        "You're like a circus clown. You're loud, annoying, and everyone hates you.",
        "I have seen rocks with more personality than you.",
        "You're so ugly, you scared the crap out of the toilet.",
        "I would say a joke, but you clearly are not capable of understanding it.",
        "I think I speak for everybody when I say that we are all impressed by your lack of talent.",
        "Wow, I didn't know it was possible to be that bad at using a keyboard! You're a true master of the art.",
        "I would say you're a joke, but jokes have a purpose.",
        "I hope you know that no one is impressed by your lack of common sense and intelligence.",
        "If ignorance were a crime, you would be serving a life sentence",
        "I am not sure if you're just really bad at English or if you are just trolling. Either way, please do everybody a favor and stop",
    ]

    let encouragingResponse = [
        "Keep pushing forward and never give up!",
        "You got this! Keep working hard and don't be afraid to ask for help when you need it.",
        "Don't let setbacks get you down. Keep striving for your goals and you will achieve them.",
        "Keep believing in yourself and don't let anyone tell you that you can't do something.",
        "Keep up the good work! You are doing an amazing job and you should be proud of yourself.",
        "Keep your chin up and remember that you are capable of achieving great things.",
        "You are strong and capable, and you can overcome any challenge that comes your way. Keep going!",
        "You are doing great! Keep up the positive attitude and keep working towards your goals.",
        "Don't be afraid to take risks and try new things. You never know what amazing things you might accomplish.",
        "Keep up the good vibes and don't let anyone bring you down. You are amazing and you can do anything you set your mind to!",
    ]

    console.log(target, context.username, msg, trimmedMsg)

    if (trimmedMsg === "!hello") {
        client.say(target, `Hello ${context.username}!`);
    } else if (trimmedMsg === '!funny') {
        let response = funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
        client.say(target, `${response}`);
    } else if (trimmedMsg === '!encourage') {
        let response = encouragingResponse[Math.floor(Math.random() * encouragingResponse.length)];
        client.say(target, `${response}`);
    } else if (splitMsg[0] === '!addquote') {
        let quote = splitMsg.slice(1).join(" ");
        console.log(quote, "I am the quote");
        addQuote(quote);
        client.say(target, `Quote added!`);
        console.log(quotes, "I am in the add");
    } else if (trimmedMsg === '!quote') {
        console.log(quotes, "I am in the response");
        let response = getRandomQuote();
        client.say(target, `${response}`);
    } else if (trimmedMsg === '!points') {
        if (channelPoints[context.username]) {
            client.say(target, `${context.username} has ${channelPoints[context.username]} points!`);
        } else {
            client.say(target, `${context.username} has 0 points!`);
        }
    }
}


function onConnectionHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}