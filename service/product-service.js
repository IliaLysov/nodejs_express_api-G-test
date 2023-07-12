const ProductModel = require('../models/schemas/product-model')
const ApiError = require('../exceptions/api-error')
const easyYandexS3 = require('easy-yandex-s3').default
const {Types} = require('mongoose')

const s3 = new easyYandexS3({
    auth: {
        accessKeyId: process.env.YANDEX_CLOUD_ID,
        secretAccessKey: process.env.YANDEX_CLOUD_KEY
    },
    Bucket: 'gardener-plants',
    debug: false
})

class ProductService {
    async uploadImagesToCloud(images) {
        let uploadedFiles = []
        for (let i=0; i < images.length; i++) {
            const file = await s3.Upload({buffer: images[i].buffer}, '/images/')
            uploadedFiles.push(file)
        }
        return uploadedFiles
    }

    async uploadOneProduct(data) {
        const candidate = await ProductModel.findOne({created_at: data.created_at, name: data.name})
        if (candidate) {
            throw ApiError.BadRequest(`Растение ${data.name} уже существует`)
        }
        const product = await ProductModel.create(data)
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

    async deleteOneProduct(productId) {
        const response = await ProductModel.deleteOne({_id: new Types.ObjectId(productId)})
        return response
    }
}

module.exports = new ProductService()