const nodemailer = require('nodemailer');

// Создаем транспорт для отправки писем


class MailManager {
    constructor () {
        this.transporter = nodemailer.createTransport({
            host: 'mail.hosting.reg.ru', // SMTP-сервер, используемый для отправки писем
            port: 587, // Порт SMTP
            secure: false, // true для 465, false для других портов
            auth: {
                user: 'tmk@clinicode.ru', // Ваш email
                pass: 'sG9#hN7&uFaZ3#gZ'     // Ваш пароль
            }
        });
        
    }
        
    async getTransporter() {
        return this.transporter
    }
    async getMailOptionsCode(to, code, link) {
        let mailOptions = {
            from: '"ТМК" <tmk@clinicode.ru>', // Отправитель
            to: to, // Получатель
            subject: 'Подтверждение регитрации в системе Телемедицинских Консультаций', // Тема письма
            text: 'Подтверждение регитрации в системе Телемедицинских Консультаций', // Текстовое содержание письма
            html: `
                <!DOCTYPE html>
                <html lang="ru">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Подтверждение почты</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .code {
                            font-size: 24px;
                            color: red;
                            text-align: center;
                            margin: 20px 0;
                        }
                        .content {
                            font-size: 16px;
                            color: #333333;
                            margin-bottom: 20px;
                        }
                        .link {
                            font-size: 16px;
                            color: #0066cc;
                            text-align: center;
                            display: block;
                            margin: 20px 0;
                            text-decoration: none;
                        }
                        .footer {
                            font-size: 12px;
                            color: #999999;
                            text-align: center;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="content">
                            Здравствуйте,
                            <br><br>
                            Благодарим вас за регистрацию. Пожалуйста, используйте следующий код для подтверждения вашего адреса электронной почты:
                        </div>
                        <div class="code">
                            ${code}
                        </div>
                        <div class="content">
                            Если вы не регистрировались на нашем сайте, пожалуйста, проигнорируйте это письмо. 
                            <br><br>
                            Также Вы можете использовать URL-адрес ниже, чтобы выполнить регистрацию:
                            <br><br>
                            <a href="${link}" class="link">Подтвердить адрес электронной почты</a>
                        </div>
                        <div class="footer">
                            &copy; 2024 Компания. Все права защищены.
                        </div>
                    </div>
                </body>
                </html>` // HTML-содержание письма
        };
        return mailOptions
    }
}

module.exports = new MailManager();