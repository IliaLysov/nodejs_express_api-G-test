const Router = require('express')
const router = new Router()
const multer = require('multer')

const authMiddleware = require('../middleware/auth.middleware')
const organizationController = require('../controllers/organization-controller')

const storage = multer.memoryStorage()
const imagesMiddleware = multer({storage: storage})

router.post('/registration', authMiddleware, imagesMiddleware.array('logo', 1), organizationController.registration)

module.exports = router