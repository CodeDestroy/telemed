const axios = require('axios');
const HEALTHY_CHILD_API_URL = process.env.HEALTHY_CHILD_API_URL //'https://10.36.0.13:8443/'

const $api = axios.create({
    withCredentials: true,
    baseURL: HEALTHY_CHILD_API_URL,
    //sameSite: true, 
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token enIzNkB5YW5kZXgucnU6MjMwOTc3'
    },
    //secure: true,
    httpOnly: true
});

class healthyChildApi {
    async getOnlineSched() {
        const request = await $api.get('/api/get-online-sched')
        return request.data
    }
    
    async getOnlineClientInfo (clid) {
        const request = await $api.get('/api/get-online-client-info', {params: {clid}})
        return request.data
    }

    async getOnlineEmployeeInfo (empid) {
        const request = await $api.get('/api/get-online-employee-info', {params: {empid}})
        return request.data
    }

    async getOnlineRequestInfo (rqstid) {
        const request = await $api.get('/api/get-online-request-info', {params: {rqstid}})
        return request.data
    }

    async setOnlineRequestPaid (rqstid, sum) {
        /* 
        const data = {
            "rqstid": ID заявки,
            "sum": сумма оплаты в рублях
        }
        */
        const response = await $api.post('/api/set-online-request-paid', {rqstid, sum})
        return response.data;
    }

    async setOnlineRequestDone (rqstid) {
        /* 
        const data = {
            "rqstid": ID заявки
        }
        */
        const response = await $api.post('/api/set-online-request-done', {rqstid})
        return response.data;
    }

    async cancelOnlineRequest (rqstid) {
        /* 
        const data = {
            "rqstid": ID заявки
        }
        */
        const response = await $api.post('/api/cancel-online-request', {rqstid})
        return response.data;
    }
    
}

module.exports = new healthyChildApi();