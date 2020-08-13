/*  const client = require('./client')

 client('1291590730276917248')
 .then(console.log)
 .catch(console.error)
 */
 /*         var options = {
            reply_markup: JSON.stringify({
                inline_keyboard: [variants.map(variant => ({ text: `Bitrate ${variant.bitrate}`, callback_data: variant.url }))]
            })
        }
 */

 
/* bot.on('callback_query', function onCallbackQuery(response) {
    console.log(response)
    bot.sendMessage(response.message.chat.id, response.data)
 }) */
const parser = require('./parserTweet')
parser('https://www.youtube.com/watch?v=iqI7ZHVniSg')
