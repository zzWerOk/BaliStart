const Router = require('express')
const router = new Router()
const toursController = require('../controllers/toursController')
const authMiddleWare = require('../middleware/authMiddleWare')
const checkIsAdmin = require('../middleware/checkIsAdminMiddleWare')

router.post('/create',authMiddleWare,toursController.create)
router.post('/change',authMiddleWare,toursController.change)
router.get('/getAll',toursController.getAll)
router.get('/getById',authMiddleWare,toursController.getById)
router.get('/getByMapPoint',authMiddleWare,toursController.getByMapPoint)
router.delete('/',checkIsAdmin,toursController.deleteTour)

module.exports = router