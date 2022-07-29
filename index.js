const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
var helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
  });

const session = require('express-session');
const flash = require("connect-flash");
const FileStore = require('session-file-store')(session);

const app = express();
app.set('view engine','hbs');

app.use(express.static('public'));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// set up flash
app.use(session({
    store: new FileStore(), // use new file to store session
    secret: 'keyboard-cat', // used to generate session id
    resave: false, // do we automatically recreate the session even if there is no change to it
    saveUninitialized: true // if a new broswer connects, do we create a new session
}))

// register flash messages
app.use(flash());

//stup a middleware to inject the session data into hbs files
app.use(function(req,res,next){
    // res.locals wil contain all the variables available to hbs files
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
})

const landingRoutes = require('./routes/landing');
const productsRoutes = require('./routes/products')

async function main (){
    // app.get('/',function(req,res){
    //     res.send("It's alive!")
    // })
    app.use('/',landingRoutes);
    app.use('/products',productsRoutes);
}
main();

app.listen(4000,function(req,res){
    console.log("server started")
})