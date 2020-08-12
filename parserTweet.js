const mql = require('@microlink/mql')

module.exports = async (url) => {
    const { data } = await mql(url, { video: true })
    return data.video
}