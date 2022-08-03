const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { User, BlacklistedToken } = require('../../models');
const { checkIfAuthenticatedJWT } = require('../../middlewares');

const generateAccessToken = function (username, id, email, tokenSecret, expiry) {
    // 1st arg -- payload
    return jwt.sign({
        username, id, email
    }, tokenSecret, {
        expiresIn: expiry
    })
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    // the output will be converted to hexdecimal
    const hash = sha256.update(password).digest('base64');
    return hash;
}


router.post('/login', async function (req, res) {
    const user = await User.where({
        email: req.body.email,
        password: getHashedPassword(req.body.password)
    }).fetch({
        require: false
    });
    // if user with the provided email and password is found, we create jwt, else error
    if (user) {
        // create the jwt
        const accessToken = generateAccessToken(
            user.get('username'),
            user.get('id'),
            user.get('email'),
            process.env.TOKEN_SECRET,
            '1h'
        )

        const refreshToken = generateAccessToken(
            user.get('username'),
            user.get('id'),
            user.get('email'),
            process.env.REFRESH_TOKEN_SECRET,
            '7d'
        )

        res.json({
            accessToken,
            refreshToken
        })

    } else {
        // error
        res.status(400);
        res.json({
            error: 'Invalid email or password'
        })
    }
})

router.get('/profile', checkIfAuthenticatedJWT, function (req, res) {
    const user = req.user;
    res.json(user)
})

router.post('/refresh', async function (req,res){
    // get the refresh token from the body - do not need to use the header for that
    const refreshToken = req.body.refreshToken;
    if(refreshToken){
        // checkif token is already blacklisted
        const blacklistedToken = await BlacklistedToken.where({
            token:refreshToken
        }).fetch({
            require:false
        })

        // if blacklisted token isnot null, then it means it exists
        if(blacklistedToken){
            res.status(400);
            res.json({
                error:"Refresh token has been blacklisted"
            })
            return;
        }

        // verify if it is legit
        jwt.verify(refreshToken,
            process.env.REFRESH_TOKEN_SECRET,function (err,tokenData){
                if (!err){
                    // generate a new access token and send back
                    const accessToken = generateAccessToken(
                        tokenData.username, 
                        tokenData.id, 
                        tokenData.email, 
                        process.env.TOKEN_SECRET,
                        '1h'
                    )
                    res.json({
                        accessToken
                    })
                }else{
                    res. status(400);
                    res.json({
                        error:'Invalid refresh token'
                    })
                }
            })

    } else{
        res.status(400);
        res.json({
            error:'No refresh token found'
        })
    }
})

router.post('/logout',async function(req,res){
    const refreshToken = req.body.refreshToken
    if(refreshToken){
        // if refreshToken exists we will add to blacklist table
        jwt.verify(refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async function(err,tokenData){
            if(!err){
                // add refresh token to blacklist
                const token = new BlacklistedToken();
                token.set('token',refreshToken);
                token.set('date_created', new Date())
                await token.save();
                res.json({
                    message:"RefreshToken found!"
                })
            }
        })
    } else{
        // if not found
        res.status(400);
        res.json({
            error:"No refresh token found!"
        })
    }
})

module.exports = router;