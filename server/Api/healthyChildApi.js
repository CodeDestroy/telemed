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

    async getOnlineRequestInfo (rqstid) {
        const request = await $api.get('/api/get-online-request-info', {params: {rqstid}})
        return request.data
    }

    async setOnlineRequestPaid (data) {
        return null;
    }

    async setOnlineRequestDone (data) {
        return null;
    }
}

module.exports = new healthyChildApi();