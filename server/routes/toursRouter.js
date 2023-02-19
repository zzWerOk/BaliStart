const Router = require('express')
const router = new Router()
const toursController = require('../controllers/toursController')
const authMiddleWare = require('../middleware/authMiddleWare')
const checkIsAdmin = require('../middleware/checkIsAdminMiddleWare')

router.post('/create',checkIsAdmin,toursController.create)
router.post('/change',checkIsAdmin,toursController.change)
router.post('/guidecanadd',checkIsAdmin,toursController.guidecanadd)
router.get('/getAllAdmin',authMiddleWare,toursController.getAllAdmin)
router.get('/getAll',toursController.getAll)
router.get('/data/:id',toursController.getData)
router.get('/getById',authMiddleWare,toursController.getById)
router.get('/getByMapPoint',authMiddleWare,toursController.getByMapPoint)
router.delete('/',checkIsAdmin,toursController.deleteTour)

module.exports = router