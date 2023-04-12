
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

            const uploadedFiles = []

            for (let i = 0; i < req.files.length; i++) {
                const {path, originalname} = req.files[i]
                const parts = originalname.split('.')
                const ext = parts[parts.length - 1]
                const newPath = path + '.' + ext
                fs.renameSync(path, newPath)
                uploadedFiles.push(newPath)
            }
            const { name, description } = req.body
            const productData = await productService.uploadOneProduct(name, description, uploadedFiles, req.user.id)
            console.log(productData)
            return res.json(productData)
        } catch (e) {
            next(e)
        }
    }

    async getProducts(req, res, next) {
        try {
            const products = await productService.getAllProducts()
            return res.json(products)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ProductController()