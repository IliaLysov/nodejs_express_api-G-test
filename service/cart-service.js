const { Types } = require("mongoose");
const ApiError = require("../exceptions/api-error");
const CartModel = require("../models/schemas/cart-model");
const CartDto = require("../dtos/cart-dto")


class CartService {
    async add(userId, {productId, count}) {
        const document = await CartModel.findOne({userId: userId, productId: productId})
        if (document) {
            throw ApiError.BadRequest(`Данный товар уже находится у вас в корзине`)
        }
        const response = await CartModel.create({userId, productId, count})
        const cartDto = new CartDto(response)
        return cartDto
    }

    async remove(userId, cartId) {
        const document = await CartModel.findOne({_id: new Types.ObjectId(cartId)})
        if (document.userId.toString() !== userId) {
            throw ApiError.BadRequest(`У вас нет прав адалить этот товар из корзины`)
        }
        const response = await CartModel.deleteOne({_id: new Types.ObjectId(cartId)})
        return response
    }

    async update(userId, {cartId, count}) {
        const document = await CartModel.findOne({_id: new Types.ObjectId(cartId)})
        if (document.userId !== userId) {
            throw ApiError.BadRequest(`Данного товара нет в вашей корзине`)
        }
        if (document.count === count) {
            throw ApiError.BadRequest(`Количество товаров совпадает`)
        }
        const newCart = await CartModel.updateOne({_id: document._id}, {$set: {count: count}})
        const cartDto = new CartDto(newCart)
        return cartDto
    }

    async getAll(userId) {
        const documents = await CartModel.find({userId})
        const newDtoCarts = documents.map(obj => new CartDto(obj))
        return newDtoCarts
    }

    async setAll(array) {
        const collection = CartModel.insertMany(array)
        const dtoCarts = collection.map(obj => new CartDto(obj))
        return dtoCarts
    }
}

module.exports = new CartService()
