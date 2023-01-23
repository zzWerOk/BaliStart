const Router = require('express')
const router = new Router()
const tableUpdatesController = require('../controllers/tableUpdatesController')
const authMiddleWare = require('../middleware/authMiddleWare')

router.post('/set',authMiddleWare,tableUpdatesController.set)
router.get('/getbyname',authMiddleWare,tableUpdatesController.get)

module.exports = router