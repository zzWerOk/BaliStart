const Router = require('express')
const router = new Router()
const topicsCategoryController = require('../controllers/toursCategoryController')
const authMiddleWare = require('../middleware/authMiddleWare')
const checkIsAdmin = require('../middleware/checkIsAdminMiddleWare')

router.post('/create',authMiddleWare,topicsCategoryController.create)
router.post('/change',authMiddleWare,topicsCategoryController.change)
router.post('/active',authMiddleWare,topicsCategoryController.setActive)
router.get('/all',authMiddleWare, topicsCategoryController.getAll)
router.get('/:id',authMiddleWare, topicsCategoryController.getById)
router.delete('/',checkIsAdmin,topicsCategoryController.deleteTopicCategory)

module.exports = router