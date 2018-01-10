const config = require ('../.././config/development.json');
const knex = require('knex')({
  client: 'postgres',
  connection: config.POSTRGES,
  pool: {
    max: 200,
    min: 1
  }
});
  
const bookshelf = require('bookshelf')(knex);
bookshelf.plugin('registry');
  
module.exports = {
  bookshelf,
  knex,
};