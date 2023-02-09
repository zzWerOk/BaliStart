const Router = require('express')
const router = new Router()
const userController = require('../controllers/TopicCommentsController')
const authMiddleWare = require("../middleware/authMiddleWare");
const getUserMiddleWare = require("../middleware/getUserMiddleWare");
const checkIsAdmin = require("../middleware/checkIsAdminMiddleWare");

router.post('/add',authMiddleWare,userController.addComment)
router.post('/edit',authMiddleWare,userController.editComment)
// router.get('/:id',userController.getById)
router.get('/all', getUserMiddleWare,userController.getAll)
router.delete('/',authMiddleWare,userController.deleteComment)

module.exports = router