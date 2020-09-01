const mql = require('@microlink/mql')

module.exports = async (url) => {
    const result = await mql(url, { video: true })
    return result.data.video
}

