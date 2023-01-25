const Router = require('express')
const router = new Router()
const mapPointController = require('../controllers/mapPointController')
const checkIsGuideOrAdminMiddleWare = require('../middleware/checkIsGuideOrAdminMiddleWare')

router.post('/create',checkIsGuideOrAdminMiddleWare,mapPointController.create)
router.post('/change',checkIsGuideOrAdminMiddleWare,mapPointController.change)
router.get('/getAll',mapPointController.getAll)
router.get('/getById',mapPointController.getById)
router.get('/getByTour',mapPointController.getByTour)
router.delete('/delete',checkIsGuideOrAdminMiddleWare,mapPointController.deleteMapPoint)
router.get('/data/:id', mapPointController.getData)

module.exports = router