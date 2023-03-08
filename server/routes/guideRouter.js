const Router = require('express')
const router = new Router()
const guideController = require('../controllers/guideController')
const authMiddleWare = require('../middleware/authMiddleWare')
const checkIsAdmin = require('../middleware/checkIsAdminMiddleWare')
const getUserMiddleWare = require('../middleware/getUserMiddleWare')

router.post('/create',authMiddleWare,guideController.create)
router.post('/changeAdmin',checkIsAdmin,guideController.changeAdmin)
router.post('/change',getUserMiddleWare,guideController.change)
router.get('/getAll',authMiddleWare,guideController.getAll)
router.get('/getById/:id',authMiddleWare,guideController.getById)
router.delete('/delete',checkIsAdmin,guideController.deleteGuide)

router.get('/getGuideById',getUserMiddleWare,guideController.getGuideById)

module.exports = router