function cors(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://phenomenal-daffodil-52450e.netlify.app")
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE")
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.header("Access-Control-Allow-Credentials", "true")
    next()
}

module.exports = cors