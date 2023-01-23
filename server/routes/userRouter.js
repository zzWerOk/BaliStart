const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleWare = require('../middleware/authMiddleWare')
const checkIsAdmin = require('../middleware/checkIsAdminMiddleWare')

router.post('/registration',userController.registration)
router.post('/login',userController.login)
router.post('/role',authMiddleWare,userController.setRole)
router.post('/active/',authMiddleWare,userController.setActive)
router.get('/active/:id',authMiddleWare,userController.isActive)
router.delete('/',checkIsAdmin,userController.deleteUser)
router.get('/auth', authMiddleWare, userController.auth)
router.get('/all',authMiddleWare, userController.getAll)
router.get('/:id',authMiddleWare, userController.getById)

module.exports = router