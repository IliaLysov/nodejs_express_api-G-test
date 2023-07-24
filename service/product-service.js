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

    async deleteImagesFromCloud(images) {
        await Promise.all(images.map(async key => await s3.Remove(key)))
    }

    async uploadOneProduct(data) {
        const candidate = await ProductModel.findOne({created_at: data.created_at, name: data.name})
        if (candidate) {
            throw ApiError.BadRequest(`Растение ${data.name} уже существует`)
        }
        const product = await ProductModel.create(data)
        return product
    }

    async getAllProducts(skip, appliedFilters, sort) {
        const filter = []

        appliedFilters?.price && filter.push({price: {$gte: appliedFilters.price.min, $lte: appliedFilters.price.max}})


        const products = await ProductModel.find(appliedFilters ? {
            $and: filter
        } : {}).limit(10).skip(skip)
        return products
    }

    async getFilters(id) {
        const body = [
            {
                $group: {
                    _id: null,
                    maxPrice: {$max: '$price'},
                    minPrice: {$min: '$price'}
                }
            }
        ]

        id && body.unshift({
            $match: {
                created_at: new Types.ObjectId(id)
            }
        })

        const response = await ProductModel.aggregate(body)
        const filters = {
            price: {min: response[0].minPrice, max: response[0].maxPrice}
        }
        return filters
    }

    async getOwnProducts(skip, filter, sort, id) {
        const products = await ProductModel.find({created_at: id}).limit(10).skip(skip)
        return products
    }

    

    async deleteOneProduct(productId) {
        const product = await ProductModel.findOne({_id: new Types.ObjectId(productId)})
       
        await Promise.all(product.images.map(async image => await s3.Remove(image.Key)))

        const response = await ProductModel.deleteOne({_id: new Types.ObjectId(productId)})
        return response
    }

    async updateOneProduct(data, newImages, deleteImages) {
        const id = data.id
        delete data.id

        deleteImages && await ProductModel.updateOne({_id: new Types.ObjectId(id)}, {$pull: {images: {Key: {$in: deleteImages}}}})

        const response = await ProductModel.updateOne(
            {_id: new Types.ObjectId(id)},
            {
                $set: data,
                $push: {images: {$each: newImages}}
            }    
        )

        return response
    }

    async getOneProduct(id) {
        const product = await ProductModel.findById({_id: new Types.ObjectId(id)})
        return product
    }

    async getManyProducts(array) {
        const objectId = array.map(id => new Types.ObjectId(id))
        const products = await ProductModel.find({_id: {$in: objectId}})
        return products
    }
}

module.exports = new ProductService()