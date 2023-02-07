const Router = require('express')
const router = new Router()
const userController = require('../controllers/TopicCommentsController')

router.post('/add',userController.addComment)
router.post('/edit',userController.editComment)
// router.get('/:id',userController.getById)
router.get('/all',userController.getAll)
router.delete('/',userController.deleteComment)

module.exports = router