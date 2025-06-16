const axios = require('axios');

const SMSC_API_URL = "https://smsc.ru/sys/send.php";
const SMS_CENTER_LOGIN = process.env.SMS_CENTER_LOGIN;
const SMS_CENTER_PASSWORD = process.env.SMS_CENTER_PASSWORD;

class SmsProstoApi {
    constructor() {
        this.api = axios.create({
            baseURL: SMSC_API_URL,
        });
    }

    /**
     * Общий метод отправки сообщений
     * @param {object} options - параметры запроса
     */
    async _sendMessage(options) {
        try {
            const params = {
                login: SMS_CENTER_LOGIN,
                psw: SMS_CENTER_PASSWORD,
                fmt: 3, // формат ответа: JSON
                ...options
            };

            const response = await this.api.get('', { params });

            if (response.data?.id) {
                console.log('Сообщение успешно отправлено:', response.data);
                return response.data;
            } else {
                console.error('Ошибка при отправке сообщения:', response.data);
                return null;
            }
        } catch (error) {
            console.error('Ошибка при обращении к API SMSC:', error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Отправка WhatsApp-сообщения
     */
    async sendWhatsAppMessage(phone, text) {
        return this._sendMessage({
            phones: phone,
            mes: text,
            whatsapp: 1
        });
    }

    /**
     * Отправка SMS-сообщения
     */
    async sendSmsMessage(phone, text) {
        return this._sendMessage({
            phones: phone,
            mes: text
        });
    }

    /**
     * Отправка Telegram-сообщения
     */
    async sendTelegramMessage(phone, text) {
        return this._sendMessage({
            phones: phone,
            mes: text,
            telegram: 1
        });
    }
}

module.exports = new SmsProstoApi();
