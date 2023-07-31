const favoritesService = require("../service/favorites-service")


class FavoritesController {
    async add(req, res, next) {
        try {
            const userId = req.user.id
            const newCart = await favoritesService.add(userId, req.body.productId)
            return res.json(newCart)
        } catch (e) {
            next(e)
        }
    }

    async remove(req, res, next) {
        try {
            const userId = req.user.id
            const response = await favoritesService.remove(userId, req.body.favoritesId)
            return res.json(response)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new FavoritesController()