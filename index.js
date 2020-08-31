const parserTweet = require('./parserTweet')

const p = parserTweet('https://www.youtube.com/watch?v=qHauEbvA3Bw')

p.then(value => console.log(value))