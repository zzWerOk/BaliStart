const Router = require('express')
const router = new Router()
const guideController = require('../controllers/agentController')
const authMiddleWare = require('../middleware/authMiddleWare')
const checkIsAdmin = require('../middleware/checkIsAdminMiddleWare')

router.post('/create',authMiddleWare,guideController.create)
router.post('/changeAdmin',checkIsAdmin,guideController.changeAdmin)
router.post('/change',authMiddleWare,guideController.change)
router.get('/getAll',authMiddleWare,guideController.getAll)
router.get('/getById/:id',authMiddleWare,guideController.getById)
router.delete('/delete',checkIsAdmin,guideController.deleteAgent)

router.get('/getAgentById',authMiddleWare,guideController.getAgentById)

module.exports = router