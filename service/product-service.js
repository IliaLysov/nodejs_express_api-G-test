const ProductModel = require('../models/schemas/product-model')
const ApiError = require('../exceptions/api-error')

class ProductService {
    async uploadOneProduct(name, description, images, userId) {
        const candidate = await ProductModel.findOne({userId, name})
        if (candidate) {
            throw ApiError.BadRequest(`Растение ${name} уже существует`)
        }
        const product = await ProductModel.create({name, description, images, created_at: userId})

        return product
    }


    async getAllProducts() {
        const products = await ProductModel.find()
        return products
    }
}

module.exports = new ProductService()