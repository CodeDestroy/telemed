const healthyChildApi = require('../Api/healthyChildApi')

class IntegrationController {
    async getOnlineSched (req, res) {
        const data = await healthyChildApi.getOnlineSched()
        res.json(data)
    }

}

module.exports = new IntegrationController()
