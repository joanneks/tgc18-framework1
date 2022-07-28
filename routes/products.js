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

// targete URL: /products/:product_id/update
router.get('/:product_id/update', async function(req,res){
    // 1. get the product that is being updated
    // select * from products where product_id = <req.params.product_id>
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true  // if not found will cause an exception (aka an error)
    })
    // 2. create the form to update the product
    const productForm = createProductForm();
    // 3. fill the form with the previous values of the product
    productForm.fields.name.value = product.get('name');
    productForm.fields.cost.value = product.get('cost');
    productForm.fields.description.value = product.get('description');

    res.render('products/update',{
        'form':productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })
})

router.post('/:product_id/update', async function(req,res){
    const productForm = createProductForm();

    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true  // if not found will cause an exception (aka an error)
    })

    // handle function will run the validation on the data
    productForm.handle(req, {
        'success':async function(form) {
            // the form arguments contain whatever the user has typed into the form
            // update products set name=?, cost=?, description=? where product_id=?
            // product.set('name', form.data.name);
            // product.set('description', form.data.description);
            // product.set('cost', form.data.cost);
            product.set(form.data);  // for the shortcut to work,
                                     // all the keys in form.data object
                                    // must be a column name in the table
            await product.save();
            res.redirect('/products')
        },
        'error': async function(form) {
            res.render('products/update',{
                'product': product.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        },
        'empty': async function(form) {
            res.render('products/update',{
                'product': product.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/delete', async function(req,res){
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        'require': true
    })
    res.render('products/delete',{
        'product': product.toJSON()
    })
})

router.post('/:product_id/delete', async function(req,res){
    const product = await Product.where({
        id: req.params.product_id
    }).fetch({
        require: true
    })

    await product.destroy();
    res.redirect('/products')
})
module.exports = router;