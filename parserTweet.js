module.exports = (tweet) => {
    if(!tweet.extended_entities 
        || !tweet.extended_entities.media[0] 
        || !tweet.extended_entities.media[0].video_info 
        || !tweet.extended_entities.media[0].video_info.variants) {
        throw 'Video content not found'
    }

    var videoVariants = tweet.extended_entities.media[0].video_info.variants
    return videoVariants.flatMap((variant) => {
        if(variant.bitrate && variant.content_type && variant.url) {
            if(variant.content_type.includes('video/')) {
                let url = variant.url
                let bitrate = variant.bitrate
                return [{ url, bitrate }];
            }
        }
        return []
    })
}