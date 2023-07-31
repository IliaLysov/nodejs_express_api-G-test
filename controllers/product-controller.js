
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')
const productService = require('../service/product-service')
const { response } = require('express')
const userService = require('../service/user-service')
const organizationService = require('../service/organization-service')


class ProductController {
    async uploadProduct(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const organization = await organizationService.getOrganizationByCreated_atId(req.user.id)
            
            if (!organization || !organization.approved) {
                return next(ApiError.BadRequest('У вас нет питомника или ваш питомник еще не зарегистрирован'))
            }            
            if (organization._id.toString() !== req.user.organization) {
                return next(ApiError.BadRequest(`Вы не можете добавлять растения от имени питомника ${organization.name}`))
            }
            
            
            const body = req.body
            body.created_at = req.user.id
            body.organizationId = organization._id
            body.organizationInfo = {
                nickname: organization.nickname,
                logo: organization.logo.Location
            }            

            const productData = await productService.uploadOneProduct(body, req.files)
            return res.json(productData)
        } catch (e) {
            next(e)
        }
    }

    async getAllProducts(req, res, next) {
        try {
            const {skip, appliedFilters, sort} = req.body
            const products = await productService.getAllProducts(skip, appliedFilters, sort)
            const filters = await productService.getFilters()
            const response = {products, filters}
            return res.json(response)
        } catch (e) {
            next(e)
        }
    }

    async getOwnProducts(req, res, next) {
        try {
            const {skip, appliedFilters, sort, organizationId} = req.body
            const {id} = req.user
            const products = await productService.getOwnProducts(skip, appliedFilters, sort, organizationId)
            const filters = await productService.getFilters(organizationId)
            const response = {products, filters}
            return res.json(response)
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