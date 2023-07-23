
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')
const productService = require('../service/product-service')
const { response } = require('express')
const userService = require('../service/user-service')


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
            body.sellerAvatar = req.user.avatar.Location
            body.images = imagesInfo
            const productData = await productService.uploadOneProduct(body)
            return res.json(productData)
            // console.log(productData)
            // return res.json('ok')
        } catch (e) {
            next(e)
        }
    }

    async getAllProducts(req, res, next) {
        try {
            const {skip, filter, sort} = req.body
            const products = await productService.getAllProducts(skip, filter, sort)
            return res.json(products)
        } catch (e) {
            next(e)
        }
    }

    async getOwnProducts(req, res, next) {
        try {
            const {skip, filter, sort} = req.body
            const {id} = req.user
            const products = await productService.getOwnProducts(skip, filter, sort, id)
            return res.json(products)
        } catch (e) {
            next(e)
        }

    }

    async getManyProducts(req, res, next) {
        try {
            const idArray = req.body
            const products = await productService.getManyProducts(idArray)
            return res.json(products)
        } catch (e) {
            next(e)
        }
    }

    async updateProduct(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }

            const imagesInfo = await productService.uploadImagesToCloud(req.files)
            
            let body = req.body

            const deleteImages = Array.isArray(body.oldImages) ? body.oldImages : body.oldImages ? [body.oldImages] : null
            delete body.oldImages
            deleteImages && await productService.deleteImagesFromCloud(deleteImages)

            const productData = await productService.updateOneProduct(body, imagesInfo, deleteImages)
            return res.json(productData)
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

    async getOneProduct(req, res, next) {
        try {
            const {id} = req.body
            const response = await productService.getOneProduct(id)
            return res.json(response)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new ProductController()