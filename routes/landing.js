const express = require('express');
const router = express.Router();

router.get('/',function(req,res){
    // res.send('welcome')
    res.render('landing/index')
})
router.get('/contact-us',function (req,res){
    res.render('landing/contact-us')
})
router.get('/about-us',function(req,res){
    res.render('landing/about-us')
})

module.exports = router;