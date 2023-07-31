const ApiError = require('../exceptions/api-error')

function seller(req, res, next) {
    try {
        const isSeller = req.user.organization
        if (!isSeller) {
            return next(ApiError.NotASeller())
        }

        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}

module.exports = seller