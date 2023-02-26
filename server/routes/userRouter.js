const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleWare = require('../middleware/authMiddleWare')
const checkIsAdmin = require('../middleware/checkIsAdminMiddleWare')

router.post('/registration',userController.registration)
router.post('/login',userController.login)
router.post('/changeAdmin',checkIsAdmin,userController.changeAdmin)
router.post('/role',authMiddleWare,userController.setRole)
router.post('/active/',authMiddleWare,userController.setActive)

router.get('/active/:id',authMiddleWare,userController.isActive)
router.get('/auth', authMiddleWare, userController.auth)
router.get('/name', authMiddleWare, userController.getMyName)
router.get('/all',authMiddleWare, userController.getAll)
router.get('/allGuides',authMiddleWare, userController.getAllGuides)
router.get('/allAgents',authMiddleWare, userController.getAllAgents)
router.get('/:id',authMiddleWare, userController.getById)

router.delete('/',checkIsAdmin,userController.deleteUser)

module.exports = router