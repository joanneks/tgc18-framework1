const express = require('express');
const { Product } = require('../models');
const router = express.Router();
const {createProductForm, bootstrapField} = require('../forms/index')

router.get('/',async function(req,res){
    // fetch all products, use bookdhelf syntax
    let products = await Product.collection().fetch();
    res.render('products/index',{
        products:products.toJSON()
    })
})
router.get('/create',function (req,res){
    const productForm = createProductForm();
    res.render('products/create',{
        // get a HTML version of the form formatted
        form: productForm.toHTML(bootstrapField)
    })
})

router.post('/create', function (req,res){
    const productForm = createProductForm();
    productForm.handle(req,{
        'success':async function(form){
        // the success function is called if the form has no validation errors
        // the form argument contains what tthe user has type in
        // we need to do the eqv of INSERT INTO products (name, descriptive, cost)
                                    // VALUES (form.data.name, form.data.description,form.data.cost)
            const product = new Product() // create a new instance of the Product Model (i.e represents a new row in the table)
            product.set('name',form.data.name)
            product.set('cost',form.data.cost)
            product.set('description',form.data.description)
            await product.save()
            res.redirect('/products')

        },
        'error':function(form){
            //the error function is called if the form has validation errors
            res.render('products/create',{
                'form':form.toHTML(bootstrapField)
            })
        },
        'empty':function(form){
            // the empty function calls if the form is not filled in at all
        }
    })
})

module.exports = router;