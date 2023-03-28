const Router = require('express')
// const {check, validationResult} = require('express-validator')
const router = new Router()

const userController = require('../controllers/user-controller')
const authMiddleware = require('../middleware/auth.middleware')

router.get('/users', authMiddleware, userController.getUsers) //получаем список пользователей - доступен только для авторизованных пользователей

module.exports = router