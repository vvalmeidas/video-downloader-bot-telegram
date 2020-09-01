require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const bodyParser = require('body-parser')
var TinyURL = require('tinyurl');

const token = process.env.TELEGRAM_TOKEN
const parserTweet = require('./parserTweet')
const TWITTER_URL_REGEX = /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)\/status\/([0-9]+)/
const YOUTUBE_URL_REGEX = /(http(?:s)?:\/\/)?(?:www\.)?youtu\.?be(?:\.com)?\/?.*(?:watch)(?:.*v=|v\/|\/)([\w\-_]+)\&?/

var bot;

if(process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(token)
    bot.setWebHook('https://video-downloader-telegram-bot.herokuapp.com/' + bot.token)
} else {
    bot = new TelegramBot(token, { polling: true })
}

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Hi! Send the tweet link and wait a few seconds while I get your video 😘') 
})

bot.onText(TWITTER_URL_REGEX, (msg, watch) => {
    const chatId = msg.chat.id
    const tweetLink = watch[0]

    bot.sendMessage(chatId, "GREAT! Let me try to find your video...", { parse_mode: 'HTML' })
    parserTweet(tweetLink).then(response => {
        if(response) {
            bot.sendVideo(chatId, response.url).then(() => {
                bot.sendMessage(chatId, "Enjoy! 🤩", { parse_mode: 'HTML' })
            })
        } else {
            bot.sendMessage(chatId, "I couldn't find your video 😭 \nThis may be an internal error or the link you sent doesn't contains a video", { parse_mode: 'HTML' })
        }
    })
})

const app = express()
app.use(bodyParser.json())
app.listen(process.env.PORT)
app.post('/' + bot.token, (req, res) => {
    bot.processUpdate(req.body)
    res.sendStatus(200)
})
