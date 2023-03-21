const Router = require('express')
const router = new Router()
const messagesController = require('../controllers/messagesController')
const authMiddleWare = require('../middleware/authMiddleWare')

router.post('/create', authMiddleWare, messagesController.create)
router.post('/setMessagesSeen', authMiddleWare, messagesController.setMessagesSeen)
router.get('/getChatUsers', authMiddleWare, messagesController.getChatUsers)
router.get('/checkMessagesNew', authMiddleWare, messagesController.checkNewMessages)
router.get('/getMessagesNew', authMiddleWare, messagesController.getNewMessages)
// router.get('/:chatUserId', authMiddleWare, userController.get)
router.get('/', authMiddleWare, messagesController.get)

router.get('/newMessages', authMiddleWare, messagesController.getNewMessages)

router.delete('/',authMiddleWare,messagesController.deleteMessageById)

module.exports = router