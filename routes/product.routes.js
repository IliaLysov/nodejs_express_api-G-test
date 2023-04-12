const Router = require('express')
const router = new Router()
const multer = require('multer') //imagesMiddleware
const path = require('path') //imagesMiddleware

const productController = require('../controllers/product-controller')
const authMiddleware = require('../middleware/auth.middleware')
const sellerMiddleware = require('../middleware/seller.middleware')

const imagesMiddleware = multer({dest: path.join('files', 'products', 'images')}) //imagesMiddleware


router.post('/upload', authMiddleware, sellerMiddleware, imagesMiddleware.array('images', 5), productController.uploadProduct)
router.get('/get', authMiddleware, productController.getProducts)

module.exports = router