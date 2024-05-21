const userService = require("../Services/user-service");


class AuthController {

    async login(req, res) {
        try {
            const login = req.body.login;
            const password = req.body.password
            
            const userData = await userService.login(login, password);
            if (userData.message != undefined)
                throw ApiError.BadRequest(userData.message)
            else {
                await res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'none', secure: true, httpOnly: true})
                return res.status(200).json(userData);
            }
        }
        catch (e) {
            /* res.status(401).send(e.message) */
            return res.status(401).json(e.message)
        }
    }

    async refresh (req, res) {
        try {
            const {refreshToken} = req.cookies;

            const userData = await userService.refresh(refreshToken);

            await res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'none', secure: true, httpOnly: true})
            return res.status(200).json(userData);
        }
        catch (e) {
            console.log(e);
            return res.status(401).json(e.message)
            
        }
    }

    async logout (req, res) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.status(200).json(token);
        }
        catch (e) {
            console.log(e);
            return res.status(401).json(e.message)
        }
    }
}

module.exports = new AuthController()

