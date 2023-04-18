const ProductModel = require('../models/schemas/product-model')
const ApiError = require('../exceptions/api-error')
const easyYandexS3 = require('easy-yandex-s3').default

const s3 = new easyYandexS3({
    auth: {
        accessKeyId: process.env.YANDEX_CLOUD_ID,
        secretAccessKey: process.env.YANDEX_CLOUD_KEY
    },
    Bucket: 'gardener-storage',
    debug: false
})

class ProductService {
    async uploadImagesToCloud(images) {
        let uploadedFiles = []
        for (let i=0; i < images.length; i++) {
            const file = await s3.Upload({buffer: images[i].buffer}, '/test/')
            uploadedFiles.push(file)
        }        
        return uploadedFiles
    }

    async uploadOneProduct(name, description, quantity, price, images, userId, sellerName) {
        const candidate = await ProductModel.findOne({created_at: userId, name})
        if (candidate) {
            throw ApiError.BadRequest(`Растение ${name} уже существует`)
        }
        console.log('service upload OneProductimages', images)
        const product = await ProductModel.create({name, description, quantity, price, images, created_at: userId, sellerName})
        return product
    }

    async getAllProducts() {
        const products = await ProductModel.find()
        return products
    }

    async getOwnProducts(userId) {
        const products = await ProductModel.find({created_at: userId})
        return products
    }
}

module.exports = new ProductService()