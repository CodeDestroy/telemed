/* require { sign, verify } from 'jsonwebtoken'; */
const { sign, verify } = require('jsonwebtoken');
const database = require('../models/index')
require('dotenv').config()
const secretAccess = process.env.SECRET_ACCESS
const secretRefresh = process.env.SECRET_REFRESH

//const tokenModel = require('../models/tokenModel')


class TokenService {
    

    //generate new tokens
    async generateTokens(payload) {
        const accessToken = sign(payload, secretAccess, {expiresIn: "30m"})
        const refreshToken = sign(payload, secretRefresh, {expiresIn: "30d"})
        
        return {
            accessToken,
            refreshToken,
        }
    }

    //check if access token is correct
    async validateAccessToken (token) {
        try {
            const userData = verify(token, secretAccess);
            return userData
        }
        catch(e) {
            return null;
        }
    }


    //check if refresh token is ok
    async validateRefreshToken (token) {
        try {
            const userData = verify(token, secretRefresh);
            return userData
        }
        catch(e) {
            console.log(e)
            return null
        }
    }

    //save refresh token to DB
    async saveToken (userId, refreshToken) {
        let tokenData = await database["Tokens"].findAll({
            where: {
                userId: userId
            }
        })
        /* let tokenData = await prisma.uirs_users_db_tokens.findMany({
            where : {
                userid: userId,
            }
            
        }); */
        if (tokenData.length > 0) {
            //result.refreshtoken = refreshToken;
            tokenData = await database["Tokens"].update({refreshToken: refreshToken}, {
                where: {
                    userId: userId
                }
            })
            /* tokenData = await prisma.uirs_users_db_tokens.updateMany({
                where: {
                    userid: userId,
                },
                data: {
                    refreshtoken: refreshToken,
                },
            }) */
            //await prisma.$queryRaw`UPDATE public.users_db_tokens SET refreshtoken = ${refreshToken} WHERE uirs_users_db_id = ${userId}`
        }
        else {
            tokenData = await database["Tokens"].create({
                refreshToken: refreshToken,
                userId: userId
            })
            /* tokenData = await prisma.uirs_users_db_tokens.create({
                data: {
                    refreshtoken: refreshToken,
                    userid: userId
                }
                
            }) */
            //await prisma.$queryRaw`INSERT INTO public.users_db_tokens (refreshtoken, uirs_users_db_id) VALUES( ${refreshToken}, ${userId} )`
        }
        //tokenData = await prisma.$queryRaw`SELECT * FROM public.users_db_tokens WHERE uirs_users_db_id = ${userId}`
        return tokenData;
    }
 
    //remove token from DB
    async removeToken (refreshToken) {
        const tokenData = await database["Tokens"].destroy({
            where: {
                refreshToken: refreshToken
            }
        })
        
        return tokenData;
    }

    //find token in DB
    async findToken (refreshToken) {

        const tokenData = await database["Tokens"].findOne({
            where: {
                refreshToken: refreshToken,
            }
        })
        return tokenData;
    }

}
module.exports = new TokenService()
/* export default new TokenService(); */