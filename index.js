const TMI = require('tmi.js');
// const { dockStart } = require('@nlpjs/basic');
// let chatBot = {};

// (async () => {
//     console.log("async function called");
//     const dock = await dockStart();
//     const nlp = dock.get('nlp');
//     chatBot = await nlp.train();
//     console.log(nlp.process('en', 'Hello world!'));
// })();
// // training(); // Start the training

const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const Analyzer = require('natural').SentimentAnalyzer;
const stemmer = require('natural').PorterStemmer;
const analyzer = new Analyzer("English", stemmer, "afinn");

const brain = require('brain.js');

const BOT_NAME = "llamachop_bot";
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

const trainingData = [
    { input: "hello", output: "Hello!" },
    { input: "how are you", output: "I'm fine, thanks!" },
    { input: "what your name", output: "My name is llamachop_bot!" },
    { input: "what your favorite color", output: "My favorite color is blue!" },
    { input: "goodbye", output: "Goodbye!" },
    { input: "tell me a joke", output: "What do you call a cow with no legs? Ground beef!" },
]

const net = new brain.recurrent.LSTM();
net.train(trainingData, {
    iterations: 1000,
    errorThresh: 0.011
});

const botMessage = async (target, message, jokes) => {
    // const response = await chatBot.process('en', message);
    // client.say(target, response);
    // console.log(analyzer.getSentiment(tokenizer.tokenize(message)));
    // console.log(net.run(message), "this is the bot message");
    result = tokenizer.tokenize(message).join(" ");
    console.log(net.run(result), "this is the result");
    console.log(net.run(result) === "", "this is the boolean");
    if (net.run(result).includes("cow")) {
        result = jokes[Math.floor(Math.random() * jokes.length)];
        client.say(target, result);
    } else {
        client.say(target, net.run(result));
    }
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

    let jokes = [  "Why couldn't the bicycle stand up by itself? Because it was two-tired.",  
        "Why did the tomato turn red? Because it saw the salad dressing.",  
        "Why did the scarecrow win an award? Because he was outstanding in his field.",  
        "Why was the math book sad? Because it had too many problems.",  
        "Why did the belt go to jail? Because it held up a pair of pants.",  
        "Why was the belt fined? Because it was caught with a belt buckle.",  
        "Why was the belt arrested? Because it was holding up a pair of pants."
    ];

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
    } else if (splitMsg[0] === '!bot') {
        botMessage(target, splitMsg.slice(1).join(" "), jokes);
    }
    
    if (msg) {
        let message = splitMsg.slice(1).join(" ");
        // botMessage(target, message);
        sentiment = analyzer.getSentiment(tokenizer.tokenize(message));
        console.log(analyzer.getSentiment(tokenizer.tokenize(message)));
        if (sentiment <= -.5) {
            let response = funnyResponses[Math.floor(Math.random() * funnyResponses.length)];
            client.say(target, `${response}`);
        } else if (sentiment >= .75) {
            let response = encouragingResponse[Math.floor(Math.random() * encouragingResponse.length)];
            client.say(target, `${response}`);
        }
    }
}


function onConnectionHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}