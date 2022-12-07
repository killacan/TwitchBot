# TwitchBot!

### Intro

Hello and welcome to llamachop_bot (named after a hat I wear on stream). This is my first project involving Machine Learning and Neural Networks. 

Basically what this project does is connect with Twitch channels and provide some extra interactivity in a way I have not yet seen before. 

Right now llamachop_bot can interact with the channel, telling jokes and insulting people, read the sentiment of messages to tell if they are significantly positive or negative and respond accordingly, and respond directly to user messages to the bot asking about itself.

I trained the model on some basic inputs and outputs. If the message comes in with !bot it will try to parse the message, check it against the data, and give a suitable match output. 

### Tech

- TMI (library for a Websocket configured specifically for Twitch.)
- Brain.js (a GPU accelerated library for Neural Networks written in JavaScript.)
- Natural (general natural language facility for nodejs.)


### Next Steps

I think the next steps for this project are going to make it more modular, allow for more user input, make a frontend, and get it hosted somewhere.