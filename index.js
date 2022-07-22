const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

const app = express();
app.set('view engine','hbs');

app.use(express.static('public'));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

const landingRoutes = require('./routes/landing')

async function main (){
    // app.get('/',function(req,res){
    //     res.send("It's alive!")
    // })
    app.use('/',landingRoutes);
}
main();

app.listen(4000,function(req,res){
    console.log("server started")
})