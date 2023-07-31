module.exports = class FavoritesDto {
    favoritesId
    productId

    constructor(model) {
        this.cartId = model._id
        this.productId = model.productId
    }
}