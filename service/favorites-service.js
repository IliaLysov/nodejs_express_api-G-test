const { Types } = require("mongoose");
const ApiError = require("../exceptions/api-error");
const FavoritesModel = require("../models/schemas/favorites-model");
const FavoritesDto = require("../dtos/favorites-dto")


class FavoritesService {
    async add(userId, productId) {
        const document = await FavoritesModel.findOne({userId: userId, productId: productId})
        if (document) {
            throw ApiError.BadRequest(`Данный товар уже находится у вас в избранных`)
        }
        const response = await FavoritesModel.create({userId, productId})
        const newFavoritesDto = new FavoritesDto(response)
        return newFavoritesDto
    }

    async remove(userId, favoritesId) {
        const document = await FavoritesModel.findOne({_id: new Types.ObjectId(favoritesId)})
        if (document.userId.toString() !== userId) {
            throw ApiError.BadRequest(`У вас нет прав адалить этот товар из корзины`)
        }
        const response = await FavoritesModel.deleteOne({_id: new Types.ObjectId(favoritesId)})
        return response
    }

    async getAll(userId) {
        const documents = await FavoritesModel.find({userId})
        const newDtoCarts = documents.map(obj => new FavoritesDto(obj))
        return newDtoCarts
    }

    async setAll(array) {
        const collection = FavoritesModel.insertMany(array)
        const dtoFavorites = collection.map(obj => new FavoritesDto(obj))
        return dtoFavorites
    }
}

module.exports = new FavoritesService()
