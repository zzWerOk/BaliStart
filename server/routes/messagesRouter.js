const Router = require('express')
const router = new Router()
const userController = require('../controllers/messagesController')
const authMiddleWare = require('../middleware/authMiddleWare')
const checkIsAdmin = require('../middleware/checkIsAdminMiddleWare')

router.post('/create', authMiddleWare, userController.create)
router.post('/setMessagesSeen', authMiddleWare, userController.setMessagesSeen)
router.get('/getChatUsers', authMiddleWare, userController.getChatUsers)
router.get('/getMessagesNew', authMiddleWare, userController.getNewMessages)
router.get('/:chatUserId', authMiddleWare, userController.get)

router.get('/newMessages', authMiddleWare, userController.getNewMessages)

router.delete('/:id',checkIsAdmin,userController.delete)

module.exports = router