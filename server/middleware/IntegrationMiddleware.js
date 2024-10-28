const ApiError = require('../Errors/api-error')
const tokenService = require('../Services/token-service')
const allowedPath = [
    '/api/login', '/api/logout', '/api/register', '/'
]
const url = require('node:url');
module.exports = async function (req, res, next) {
    try {

        const parsedUrl = url.parse(req.originalUrl);
        const authHeader = req.headers.authorization;
        
        /* if (allowedPath.includes(parsedUrl.pathname)) {
            // Для маршрута /auth/login разрешаем доступ без токена
            console.table(`Путь запроса ${parsedUrl.pathname}`)
            return next();
        } */
        if (!authHeader) 
            return next(ApiError.UnauthorizedError())
        const accessToken = authHeader.split(' ')[1]
        
        if (!accessToken)
            return next(ApiError.UnauthorizedError())
        //Тут нужно искать токен который выдан сервису в БД, если токен есть - пропускаем дальше
        const userData = await tokenService.validateAccessToken(accessToken)
        
        if (!userData)
            return next(ApiError.UnauthorizedError())
        req.user = userData;
        next()
    }
    catch(e) {
        return next(ApiError.UnauthorizedError())
    }
}