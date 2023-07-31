const Router = require('express')
const router = new Router()

const authMiddleware = require('../middleware/auth.middleware')
const cartController = require('../controllers/cart-controller')


router.post('/add', authMiddleware, cartController.add)
router.post('/remove', authMiddleware, cartController.remove)
router.post('/update', authMiddleware, cartController.update)

module.exports = router