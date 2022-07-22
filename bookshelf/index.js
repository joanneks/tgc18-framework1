const knex = require('knex')({
    client:'mysql',
    connection: {
        user:'joanneks',
        password:'Tech2022',
        database:'organic'
    }
});

const bookshelf = require('bookshelf')(knex);
module.exports = bookshelf
