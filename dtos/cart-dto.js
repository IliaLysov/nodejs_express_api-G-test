module.exports = class CartDto {
    cartId
    productId
    count

    constructor(model) {
        this.cartId = model._id
        this.productId = model.productId
        this.count = model.count
    }
}