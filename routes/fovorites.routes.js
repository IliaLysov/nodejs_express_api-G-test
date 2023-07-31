const Router = require('express')
const router = new Router()

const authMiddleware = require('../middleware/auth.middleware')
const favoritesController = require('../controllers/favorites-controller')


router.post('/add', authMiddleware, favoritesController.add)
router.post('/remove', authMiddleware, favoritesController.remove)

module.exports = router