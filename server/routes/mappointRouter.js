const Router = require('express')
const router = new Router()
const mapPointController = require('../controllers/mapPointController')
const authMiddleWare = require('../middleware/authMiddleWare')
const checkIsAdmin = require('../middleware/checkIsAdminMiddleWare')
const checkIsGuideOrAdminMiddleWare = require('../middleware/checkIsGuideOrAdminMiddleWare')


router.post('/crate',checkIsGuideOrAdminMiddleWare,mapPointController.create)
router.post('/change',checkIsGuideOrAdminMiddleWare,mapPointController.change)
router.get('/getAll',mapPointController.getAll)
router.get('/getById',mapPointController.getById)
router.get('/getByTour',mapPointController.getByTour)
router.delete('/delete',checkIsGuideOrAdminMiddleWare,mapPointController.deleteMapPoint)

module.exports = router