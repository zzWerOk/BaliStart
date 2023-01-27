const Router = require('express')
const router = new Router()
const topicsTypeController = require('../controllers/toursTypeController')
const authMiddleWare = require('../middleware/authMiddleWare')
const checkIsAdmin = require('../middleware/checkIsAdminMiddleWare')

router.post('/create',authMiddleWare,topicsTypeController.create)
router.post('/change',authMiddleWare,topicsTypeController.change)
router.post('/active',authMiddleWare,topicsTypeController.setActive)
router.get('/all',authMiddleWare, topicsTypeController.getAll)
router.get('/:id',authMiddleWare, topicsTypeController.getById)
router.delete('/',checkIsAdmin,topicsTypeController.deleteTopicCategory)

module.exports = router