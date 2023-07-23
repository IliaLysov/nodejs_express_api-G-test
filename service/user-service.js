const bcrypt = require('bcryptjs')
const UserModel = require('../models/schemas/user-model')
const ProductModel = require('../models/schemas/product-model')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')
const {Types} = require('mongoose')

const easyYandexS3 = require('easy-yandex-s3').default
const s3 = new easyYandexS3({
    auth: {
        accessKeyId: process.env.YANDEX_CLOUD_ID,
        secretAccessKey: process.env.YANDEX_CLOUD_KEY
    },
    Bucket: 'gardener-plants',
    debug: false
})


class UserService {
    async registration(email, password, name, surname, cart, favorite) {
        const candidateEmail = await UserModel.findOne({email})
        if (candidateEmail) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`) //ловим error.middleware
        }
        const candidateName = await UserModel.findOne({name})
        if (candidateName) {
            throw ApiError.BadRequest(`Пользователь с именем ${name} уже существует`) //ловим error.middleware
        }

        const activationLink = uuid.v4()

        const hashPassword = await bcrypt.hash(password, 3)
        const user = await UserModel.create({email, password: hashPassword, name, surname, activationLink, cart, favorite})

        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`)

        const userDto = new UserDto(user) //id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка активации') //ловим error.middleware
        }
        user.isActivated = true
        await user.save()
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest(`Пользователь с почтой ${email} не был найден`) //ловим error.middleware
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль') //ловим error.middleware
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError() //ловим error.middleware
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError() //ловим error.middleware
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find()
        return users
    }

    async becomeASeller(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError() //ловим error.middleware
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const response = await UserModel.updateOne({_id: new Types.ObjectId(userData.id)}, {$set: {seller: true}})
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user)

        return {response, user: userDto}
    }

    async setAvatar(data) {
        const {user, images} = data
        const document = await UserModel.findById(new Types.ObjectId(user))
        if (document.avatar.Key) {
            await s3.Remove(document.avatar.Key)
        }
        const avatar = await Promise.all(images.map(async image => await s3.Upload({buffer: image.buffer}, '/avatars/')))
        await UserModel.updateOne({_id: new Types.ObjectId(user)}, {$set: {avatar: avatar[0]}})
        await ProductModel.updateMany({created_at: new Types.ObjectId(user)}, {$set: {sellerAvatar: avatar[0].Location}})
        document.avatar = avatar[0]
        const userDto = new UserDto(document)
        return userDto
    }

    
    async addToCart(userId, productsInfo) {
        const document = await UserModel.findById(new Types.ObjectId(userId))
        await UserModel.updateOne({_id: new Types.ObjectId(userId)}, {$set: {cart: productsInfo}})
        document.cart = productsInfo
        const userDto = new UserDto(document)

        return userDto
    }

    async addToFavorite(userId, productsIdArray) {
        const document = await UserModel.findById(new Types.ObjectId(userId))
        await UserModel.updateOne({_id: new Types.ObjectId(userId)}, {$set: {favorite: productsIdArray}})
        document.favorite = productsIdArray
        const userDto = new UserDto(document)
        return userDto
    }
}

module.exports = new UserService()