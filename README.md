Требования:
node v20.12.1,
npm v10.5.0,
postrgesql

Перед запуском:
в папке server в файле .env исправить на необходимые:
DB_USER = "psql user"
DB_PASSWORD = "psql password"
DB_HOST = "psql host"
DB_NAME = "psql db name"

в дериктории server/ и в дериктории client/tmk_client команда
npm install 

Запуск:
в дериктории server/ команда 
node ./index.js
в дериктории client/tmk_client
npm start
