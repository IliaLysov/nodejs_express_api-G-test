const Router = require('express')
const router = new Router()
const multer = require('multer') //imagesMiddleware
const path = require('path') //imagesMiddleware

const productController = require('../controllers/product-controller')
const authMiddleware = require('../middleware/auth.middleware')
const sellerMiddleware = require('../middleware/seller.middleware')


const storage = multer.memoryStorage() //imagesMiddleware
const imagesMiddleware = multer({storage: storage}) //imagesMiddleware


router.post('/upload', authMiddleware, sellerMiddleware, imagesMiddleware.array('images', 5), productController.uploadProduct)
router.post('/all', productController.getAllProducts)
router.post('/one', productController.getOneProduct)
router.post('/many', productController.getManyProducts)
router.post('/own', authMiddleware, productController.getOwnProducts)
router.patch('/update', authMiddleware, sellerMiddleware, imagesMiddleware.array('images', 5), productController.updateProduct)
router.post('/delete', authMiddleware, productController.deleteProduct)

module.exports = router