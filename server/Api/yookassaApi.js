const axios = require('axios');
const YOOKASSA_SECRET_KEY = process.env.YOOKASSA_SECRET_KEY 
const YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID 
const YOOKASSA_ENDPOINT= process.env.YOOKASSA_ENDPOINT
const YOOKASSA_TEST = (process.env.YOOKASSA_TEST == 'true' ? true : false)
const $api = axios.create({
    
    baseURL: YOOKASSA_ENDPOINT,
    //sameSite: true, 
    auth: {
      username: YOOKASSA_SHOP_ID,
      password: YOOKASSA_SECRET_KEY,
    },
    headers: {
      "Content-Type": "application/json",
    },
    //secure: true,
    /* httpOnly: true */
});

class yookassaApi { 
    async getAllPayments() {
        const request = await $api.get('/payments')
        return request.data
    }

    async createPayment({ amount, currency = "RUB", description, return_url, payment_uuid, payment_method_data = "bank_card", customerEmail, customerPhone }) {
    try {
        const paymentData = {
            amount: {
                value: amount.toFixed(2),
                currency,
            },
            confirmation: {
                type: "redirect",
                return_url,
            },
            payment_method_data: {
                type: payment_method_data,
            },
            capture: true,
            description,
            test: YOOKASSA_TEST,
            receipt: {
                customer: {},
                items: [
                    {
                        description,
                        quantity: "1.00",
                        amount: {
                            value: amount.toFixed(2),
                            currency
                        },
                        vat_code: 1
                    }
                ]
            }
        };

        if (customerEmail) paymentData.receipt.customer.email = customerEmail;
        if (customerPhone) paymentData.receipt.customer.phone = customerPhone;

        const response = await $api.post("/payments", paymentData, {
            headers: {
                "Idempotence-Key": payment_uuid,
            }
        });

        return response.data;
    } catch (error) {
        console.error("Ошибка при создании платежа:", error.response?.data || error.message);
        throw error;
    }
}


    // Получение информации о платеже
    async getPayment(paymentId) {
        try {
            const response = await $api.get(`/payments/${paymentId}`);
            return response.data;
        } catch (error) {
            console.error("Ошибка при получении платежа:", error.response?.data || error.message);
            throw error;
        }
    }

    // Отмена платежа
    async cancelPayment(paymentId) {
        try {
            const response = await $api.post(`/payments/${paymentId}/cancel`);
            return response.data;
        } catch (error) {
            console.error("Ошибка при отмене платежа:", error.response?.data || error.message);
            throw error;
        }
    }
    
}

module.exports = new yookassaApi();