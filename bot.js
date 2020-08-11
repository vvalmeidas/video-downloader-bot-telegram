require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const bodyParser = require('body-parser')

const client = require('./client')
const token = process.env.TELEGRAM_TOKEN
const TWITTER_URL_REGEX = /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)\/status\/([0-9]+)/

var bot;

if(process.env.NODE_ENV === 'production') {
    bot = new TelegramBot(token)
    bot.setWebHook('https://video-downloader-telegram-bot.herokuapp.com/' + bot.token)
} else {
    bot = new TelegramBot(token, { polling: true })
}

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Hi! Send the tweet link and wait a few seconds while I get your video 😘') 
    var options = {
        reply_markup: JSON.stringify({
          inline_keyboard: [
            [{ text: 'Some button text 1', callback_data: '1' }],
            [{ text: 'Some button text 2', callback_data: '2' }],
            [{ text: 'Some button text 3', callback_data: '3' }]
          ]
        })
      };
  bot.sendMessage(msg.chat.id, "answer.", options);
   
})

bot.onText(TWITTER_URL_REGEX, (msg, watch) => {
    const chatId = msg.chat.id
    const tweetId = watch[2]

    client(tweetId)
    .then(variants => {
        bot.sendVideo(chatId, variants[0].url)    
    })
    .catch(errors => {
        bot.sendMessage(chatId, errors.toString(), { parse_mode: 'HTML' })
    })

})

const app = express()
app.use(bodyParser.json())
app.listen(process.env.PORT)
app.post('/' + bot.token, (req, res) => {
    bot.processUpdate(req.body)
    res.sendStatus(200)
})

/* axios.get(`${process.env.OXFORD_API_URL}/entries/en-gb/${word}`, {
    params: {
        fields: 'definitions',
        strictMatch: 'false',
    },
    headers: {
        app_id: process.env.OXFORD_APP_ID,
        app_key: process.env.OXFORD_APP_KEY,
    }
}).then(response => {
    const parsedHtml = parser(response.data)
    bot.sendMessage(chatId, word, { parse_mode: 'HTML' })
    bot.sendVideo(chatId, 'https://video.twimg.com/ext_tw_video/1252031480865447937/pu/vid/480x270/hzgPncf9XKMntmLi.mp4')
}).catch(error => {
    const errorText = error.response.status === 404 ? `No definition found for the word: <b>${word}</b>` : `<b>An error occured, please try again later</b>` 
    bot.sendMessage(chatId, errorMessage, { parser_mode: 'HTML' })
})   */