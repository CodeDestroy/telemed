/* import Database from './Database' */
const Database = require('../Database')

module.exports = new Database(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_HOST)

/*  = database */

/* export default database */