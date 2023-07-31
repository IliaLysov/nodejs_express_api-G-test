const easyYandexS3 = require('easy-yandex-s3').default


const s3 = new easyYandexS3({
    auth: {
        accessKeyId: process.env.YANDEX_CLOUD_ID,
        secretAccessKey: process.env.YANDEX_CLOUD_KEY
    },
    Bucket: 'gardener-plants',
    debug: false
})

module.exports = s3