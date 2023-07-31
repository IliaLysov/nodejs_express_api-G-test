const cartService = require("../service/cart-service")


class CartController {
    async add(req, res, next) {
        try {
            const userId = req.user.id
            const newCart = await cartService.add(userId, req.body)
            return res.json(newCart)
        } catch (e) {
            next(e)
        }
    }

    async remove(req, res, next) {
        try {
            const userId = req.user.id
            const response = await cartService.remove(userId, req.body.cartId)
            return res.json(response)
        } catch (e) {
            next(e)
        }
    }

    async update(req, res, next) {
        try {
            const userId = req.user.id
            const updatedCart = await cartService.add(userId, req.body)
            return res.json(updatedCart)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new CartController()