const Router = require('express')
const router = new Router()
const mapPointController = require('../controllers/mapPointController')
const checkIsAdminMiddleWare = require('../middleware/checkIsAdminMiddleWare')

router.post('/create',checkIsAdminMiddleWare,mapPointController.create)
router.post('/change',checkIsAdminMiddleWare,mapPointController.change)
router.get('/getAll',mapPointController.getAll)
router.get('/getAllAdmin',checkIsAdminMiddleWare,mapPointController.getAllAdmin)
router.get('/getByIdAdmin/:id', checkIsAdminMiddleWare,mapPointController.getByIdAdmin)
router.get('/getById/:id',mapPointController.getById)
router.get('/getByTour',mapPointController.getByTour)
router.get('/dataAdmin/:id', checkIsAdminMiddleWare, mapPointController.getDataAdmin)
router.get('/data/:id', mapPointController.getData)

router.delete('/', checkIsAdminMiddleWare,mapPointController.deleteMapPoint)

module.exports = router