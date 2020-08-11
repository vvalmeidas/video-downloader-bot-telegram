require('dotenv').config()

var Twitter = require('twitter')
var parserTweet = require('./parserTweet')
var TweetException = require('./tweetException')

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

module.exports = (id) => {
    return new Promise((resolve, reject) => {
        client.get(`statuses/show/${id}`, (errors, tweet, response) => {
            if (!errors) {
                try {
                    resolve(parserTweet(tweet))
                } catch(e) {
                    reject(e)
                }
            } else {
                reject(errors.map(error => error.message))
            }
        })
    })

}
