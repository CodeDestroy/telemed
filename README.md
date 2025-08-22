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


next js (patient_client) <br>
В терминале npm install <br>
Создать .env (или скопировать из client/tmk_client) <br>
NEXT_PUBLIC_MED_ORG_ID = 1 <br>
NEXT_PUBLIC_PUBLIC_URL="URL ЛОКАЛЬНОГО СЕРВЕРА (БЭК) NODEJS" <br>
NEXT_PUBLIC_SERVER_URL="URL ЛОКАЛЬНОГО СЕРВЕРА (БЭК) NODEJS" //вроде не используется <br>
NEXT_PUBLIC_CLIENT_URL="URL ЛОКАЛЬНОГО СЕРВЕРА (БЭК) NODEJS" //вроде не используется
