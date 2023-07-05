
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')
const productService = require('../service/product-service')


class ProductController {
    async uploadProduct(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            // const imagesInfo = [] //will delete
            const imagesInfo = await productService.uploadImagesToCloud(req.files)
            const body = req.body
            body.sellerName = req.user.name
            body.created_at = req.user.id
            body.images = imagesInfo
            const productData = await productService.uploadOneProduct(body)
            return res.json(productData)
        } catch (e) {
            next(e)
        }
    }

    async getAllProducts(req, res, next) {
        try {
            const products = await productService.getAllProducts()
            return res.json(products)
        } catch (e) {
            next(e)
        }
    }

    async getOwnProducts(req, res, next) {
        try {
            const {id} = req.user
            const products = await productService.getOwnProducts(id)
            return res.json(products)
        } catch (e) {
            next(e)
        }

    }

    async updateProduct(req, res, next) {
        try {

        } catch (e) {
            next(e)
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const {id} = req.body
            const response = await productService.deleteOneProduct(id)
            return res.json(response)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ProductController()