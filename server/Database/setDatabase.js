/* import Database from './Database' */
const Database = require('../Database')
const config = require('../config/config.json');
const environment = process.env.NODE_ENV || 'development';
const dbConfig = config[environment];
//dbConfig.database, dbConfig.username, dbConfig.password
/* module.exports = new Database(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_HOST) */
module.exports = new Database(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig.host, dbConfig.dialect, false)

/*  = database */

/* export default database */