const Router = require('express')
const router = new Router()
const topicController = require('../controllers/topicsController')
const authMiddleWare = require('../middleware/authMiddleWare')
const getUserMiddleWare = require('../middleware/getUserMiddleWare')
const checkIsAdmin = require('../middleware/checkIsAdminMiddleWare')

router.post('/create',authMiddleWare,topicController.create)
router.post('/change',authMiddleWare,topicController.change)
router.post('/active',authMiddleWare,topicController.setActive)
router.get('/adminall',checkIsAdmin, topicController.getAllAdmin)
router.get('/all', topicController.getAll)
router.delete('/',checkIsAdmin, topicController.deleteTopic)
router.get('/data/:id', topicController.getData)
router.get('/topicdata/',getUserMiddleWare, topicController.getTopicData)
router.get('/canedit',getUserMiddleWare, topicController.getTopicCanEdit)
router.get('/:id',authMiddleWare, topicController.getById)

module.exports = router