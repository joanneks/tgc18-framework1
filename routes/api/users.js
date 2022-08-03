const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { User } = require('../../models');
const { checkIfAuthenticatedJWT } = require('../../middlewares');

const generateAccessToken = function(username, id, email, tokenSecret, expiry) {
    // 1st arg -- payload
    return jwt.sign({   
      username, id, email
    },tokenSecret,{
        expiresIn:expiry
    })
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    // the output will be converted to hexdecimal
    const hash = sha256.update(password).digest('base64');
    return hash;
}


router.post('/login',async function(req,res){
    const user = await User.where({
        email:req.body.email,
        password:getHashedPassword(req.body.password)
    }).fetch({
        require:false
    });
    // if user with the provided email and password is found, we create jwt, else error
    if (user){
        // create the jwt
        const accessToken =  generateAccessToken(
            user.get('username'),
            user.get('id'), 
            user.get('email'), 
            process.env.TOKEN_SECRET, 
            '1h')
        res.json({
            'accessToken': accessToken
        })
    } else {
        // error
        res.status(400);
        res.json({
            error:'Invalid email or password'
        })
    }
})

router.get('/profile',checkIfAuthenticatedJWT, function (req,res){
    const user = req.user;
    res.json(user)
})

module.exports = router;