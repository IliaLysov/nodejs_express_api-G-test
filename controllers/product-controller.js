
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')
const productService = require('../service/product-service')
const fs = require('fs')



class ProductController {
    async uploadProduct(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            console.log('controller uploadProduct images from req.files', req.files)
            const images = await productService.uploadImagesToCloud(req.files)
            console.log('controller uploadProduct images response from cloud', images)
            const { name, description, quantity, price } = req.body
            const productData = await productService.uploadOneProduct(name, description, quantity, price, images, req.user.id, req.user.name)
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
}

module.exports = new ProductController()