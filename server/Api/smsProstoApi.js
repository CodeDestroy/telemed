const axios = require('axios');
const SMS_PROSTO_URL = "http://api.sms-prosto.ru/" //'https://10.36.0.13:8443/'
const SMS_RPOSTO_KEY = process.env.SMS_RPOSTO_KEY;
const SMS_PROSTO_SENDER_NAME = process.env.SMS_PROSTO_SENDER_NAME;
const $api = axios.create({
    baseURL: SMS_PROSTO_URL,
    /* withCredentials: true,
    baseURL: HEALTHY_CHILD_API_URL,
    sameSite: true, 
    headers: {
        'Content-Type': 'application/json',
    },
    secure: true,
    httpOnly: true */
});

class smsProstoApi {
    async sendMessage(phone, text) {
        try {
            const request = await $api.get('', {params: {method: "push_msg", format: 'JSON', key: SMS_RPOSTO_KEY, text: text, phone: phone, sender_name: SMS_PROSTO_SENDER_NAME}})
            if (request.data.err_code != 0) {
                switch (request.data.response.msg.err_code) {
                    case '99':
                        throw new Error("Транзакция отправки SMS не прошла")
                    case '602':
                        throw new Error("Пользователя не существует. Проверьте правильность логина/пароля или api key. Ошибка также может возникать в случае если изменился ip адрес с которого направляются запросы.")
                    case '605':
                        throw new Error("Пользователь заблокирован")
                    case '607':
                        throw new Error("Имя отправителя недопустимо")
                    case '611':
                        throw new Error("Не корректно установлена стоимость SMS")
                    case '617':
                        throw new Error("Неверный формат номера получателя SMS")
                    case '618':
                    case '622':
                        throw new Error("Номер aбонента в Черном списке")
                    case '623':
                        throw new Error("Не достаточно средств. Пополните баланс.")
                    case '624':
                        throw new Error("Обнаружены запрещенные слова в тексте сообщения. Обратитесь в поддержку.")
                    case '626':
                        throw new Error("Не удалось получить данные по API KEY.")
                    case '627':
                        throw new Error("Неверный API KEY.")
                    case '628':
                        throw new Error("В рамках тестирования сервиса отправка разрешена только на номер, который привязан к личному кабинету")
                    case '631':
                        throw new Error("Сообщение отклонено. Нельзя смешивать русские и английские символы в одном слове")
                    case '632':
                        throw new Error("Незарегистрированный sender_name")
                    case '699':
                        throw new Error("Не удалось установить соединение.")
    
                }
            }
            return request
        }
        catch (e) {
            console.log(e)
            throw e
        }
        
    }

    async getBalance() {
        const request = await $api.get('', {params: {method: "get_profile", format: 'JSON', key: SMS_RPOSTO_KEY}})
        return request
    }
    
    
}

module.exports = new smsProstoApi();