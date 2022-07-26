const express = require('express');
const hbs = require('hbs')
const wax = require('wax-on');
const helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
  });

const cors = require('cors');
const jwt = require('jsonwebtoken');
//requiring in the dependencies for sessions
const session = require('express-session');
const flash = require('connect-flash');
// create a new session FileStore
const FileStore = require('session-file-store')(session);

// csrf token
const csrf = require('csurf');


require('dotenv').config();
const app = express();

app.set('view engine', 'hbs');

// enable cross-site origin resources sharing
app.use(cors());

app.use(express.urlencoded({
  extended: false
}))

const {getCart} = require('./dal/carts')

// static folder
app.use(express.static('public'))

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

// setup sessions
app.use(session({
  store: new FileStore(),  // we want to use files to store sessions
  secret: process.env.SESSION_SECRET, // used to generate the session id
  resave: false, // do we automatically recreate the session even if there is no change to it
  saveUninitialized: true, // if a new browser connects do we create a new session
}))

// enable csrf protection
// app.use(csrf());

// this is a proxy middleware
const csrfInstance = csrf();
app.use(function(req,res,next){
  // console.log("Checking for csrf exclusion");
  if (req.url === '/checkout/process_payment' || req.url.slice(0,5) == '/api/') {
    next();
  } else {
    csrfInstance(req,res,next);
  }
})
app.use(function(req,res,next){
  if(req.csrfToken){
    // the csrfToken function is avaliable because of `app.use(csrf())`
    res.locals.csrfToken = req.csrfToken(); 
  }
  next();
})


// register Flash messages
app.use(flash());  // VERY IMPORTANT: register flash after sessions

// setup a middleware to inject the session data into the hbs files
app.use(function(req,res,next){
  // res.locals will contain all the variables available to hbs files
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
})

// app.use(function(req,res,next){
//   res.locals.cloudinaryAPIKey = process.env.CLOUDINARY_API_KEY
//   next();
// })

// setup middleware to share data across all hbs files
app.use(function(req,res,next){
  res.locals.user = req.session.user;
  next()
})


app.use(async function(req,res,next){
  if (req.session.user) {
    const cartItems = await getCart(req.session.user.id);
    res.locals.cartCount = cartItems.toJSON().length;
  }
  next();
});

const landingRoutes = require('./routes/landing');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users')
const cloudinaryRoutes = require ('./routes/cloudinary')
const cartRoutes = require('./routes/carts');
const { checkIfAuthenticated } = require('./middlewares');
const checkoutRoutes = require('./routes/checkout');
 
const api = {
  products: require('./routes/api/products'),
  users: require('./routes/api/users')
}

// first arg is the prefix
app.use('/', landingRoutes);
app.use('/products', productRoutes);
app.use('/users', userRoutes);
app.use('/cloudinary',cloudinaryRoutes)
app.use('/cart', checkIfAuthenticated,cartRoutes);
app.use('/checkout',checkoutRoutes);

// register api routes
app.use('/api/products', express.json(), api.products);
app.use('/api/users',express.json(),api.users)

// app.listen(3000, function(){
//     console.log("Server has started");
// })

app.listen(process.env.PORT, function(){
  console.log("Server has started");
})

// ; DB_DRIVER=mysql
// ; DB_USER=joanneks
// ; DB_PASSWORD=Tech2022
// ; DB_DATABASE=organic
// ; DB_HOST=localhost

// ; after deployment
// ; The syntax is postgres://<user>:<password>@<host>/<database_name>?reconnect = true
// ; postgres://foqhmvwpsduona:
// ; 5b61d5f82c5311b37e6406d3e8b6b6b76a4f123a797f565cc2839452c91f3a3c
// ; @ec2-52-204-157-26.compute-1.amazonaws.com
// ; :5432/
// ; df8co7ogskll5c