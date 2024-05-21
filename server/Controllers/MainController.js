class MainController {
    async testFunc (req, res) {
        const data = req.query.data
        res.json({data: (data + ' returned')});
    }

}

module.exports = new MainController()
