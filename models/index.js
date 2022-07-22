const bookshelf = require("../bookshelf");
// const bookshelf = require("../bookshelf/index");
// same meaning, by default if we require a folder,
// nodejs will look for index.js

// a bookshelf model represents one table
// name of the model (first arg)
//  must be SINGULAR form of table name and FIRST LETTER is UPPERCASE
const Product = bookshelf.model('Product',{
    tableName: 'products'
})

module.exports = {Product};