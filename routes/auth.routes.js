const Router = require('express')
const {check, validationResult} = require('express-validator')
const router = new Router()

const userController = require('../controllers/user-controller')
const authMiddleware = require('../middleware/auth.middleware')


router.post('/registration',
[
    check('email', "Incorrect email").isEmail(),
    check('password', "Password must be longer than 3 and shorter than 12").isLength({min: 3, max: 12})
],
userController.registration)

router.post('/login', userController.login)


router.post('/logout', userController.logout) //удаляем refreshToken из БД
router.get('/activate/:link', userController.activate) //активация аккаунта по ссылке
router.get('/refresh', userController.refresh) //обновляем accessToken
router.get('/users', authMiddleware, userController.getUsers) //получаем список пользователей - доступен только для авторизованных пользователей
router.get('/seller', authMiddleware, userController.becomeASeller)

module.exports = router