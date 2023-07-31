const {validationResult} = require('express-validator')
const userService = require('../service/user-service') 
const ApiError = require('../exceptions/api-error')
const CartService = require('../service/cart-service')
const FavoritesService = require('../service/favorites-service')

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest(`Ошибка при валидации ${errors.array().map(el => el.msg).join(' ')}`, errors.array()))
            }

            const {cart, favorites, ...user} = req.body

            const userData = await userService.registration(user)

            const newCart = cart.map(obj => {
                obj.userId = userData.user.id
                return obj
            })
            const dtoCart = await CartService.setAll(newCart)

            const newFavorites = favorites.map(obj => ({...obj, userId: userData.user.id}))
            const dtoFavorites = await FavoritesService.setAll(newFavorites)

            console.log('dtoFavorites', dtoFavorites)
            
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true, secure: Boolean(process.env.SECURE), sameSite: "none"})
            return res.json({favorites: dtoFavorites, cart: dtoCart, ...userData})

        } catch (e) {
            next(e)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true, secure: Boolean(process.env.SECURE), sameSite: "none"})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken', {httpOnly: true, secure: Boolean(process.env.SECURE), sameSite: "none"})
            return res.json(token) //лучше вернуть статус-код 200
        } catch (e) {
            next(e)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link
            await userService.activate(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            console.log(e)
            res.send({message: "Server error"})
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true, secure: Boolean(process.env.SECURE), sameSite: "none"})
            return res.json(userData)
        } catch (e) {
            next(e)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers()
            return res.json(users)
        } catch (e) {
            next(e)
        }
    }

    async becomeASeller(req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const result = await userService.becomeASeller(refreshToken)
            return res.json(result)
        } catch (e) {
            next(e)
        }
    }

    async setAvatar(req, res, next) {
        try {
            const data = {}
            data.user = req.user.id
            data.images = req.files
            const response = await userService.setAvatar(data)
            return res.json(response)
        } catch (e) {
            next(e)
        }
    }

    async addToCart(req, res, next) {
        try {
            const userId = req.user.id
            const productsInfo = req.body
            const user = await userService.addToCart(userId, productsInfo)
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }

    async addToFavorite(req, res, next) {
        try {
            const userId = req.user.id
            const productsIdArray = req.body
            const user = await userService.addToFavorite(userId, productsIdArray)
            return res.json(user)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new UserController()