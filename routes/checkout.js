const express = require('express');
const router = express.Router();
const cartServices = require('../services/carts');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/',async function(req,res){
    // step 1: create the line items
    // one line in invoice is one line item
    // each item in shopping cart will become one line item
    const  items = await cartServices.getCart(req.session.user.id)
    let lineItems = [];
    let meta = [];
    // meta data - we are going to store the quantity per product that the user is buying
    for (let item of items){
        const eachLineItem={
            // use .related if items was not converted to JSON()
            name: item.related('product').get('name'),
            amount: item.related('product').get('cost'),
            quantity: item.get('quantity'),
            currency:'SGD'
        };          
        
        // check if there is an image
        if(item.related('product').get('image_url')){
            // stripe expect imaged to be an array
            eachLineItem.images = [item.related('product').get('image_url')]
        }

        lineItems.push(eachLineItem);
        meta.push({
            product_id:item.get('product_id'),
            quantity:item.get('quantity')
        })
    }
    // step 2: create stripe payment
    // metadata must be a string
    let metaData = JSON.stringify(meta);
    // key value pairs in payment object is defined by stripe
    const payment = {
        payment_method_types:['card'],
        line_items:lineItems,
        success_url:process.env.STRIPE_SUCCESS_URL+"?sessionId={CHECKOUT_SESSION_ID}",
        cancel_url:process.env.STRIPE.CANCEL_URL,
        // in the metadata, the keys are up to us to define
        // but the value must be a string
        metadata:{
            orders:metaData
        }
    }

    // step 3: register the payment session
    let stripeSession = await stripe.checkout.sessions.create(payment);

    // step 4: use stripe to pay 
    // white labeling - make it look like its not using stripe to make payment
    // (cc number and cvc MUST NEVER reach/be stored in our server - for security purposes)
    res.render('checkout/checkout',{
        sessionId: stripeSession.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
})


router.get('/success', function(req,res){
    res.send("Payment success")
})

router.get('/cancelled', function(req,res){
    res.send("Payment cancelled")
})

module.exports = router;