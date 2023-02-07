const Router = require('express')

const router = new Router()

const userRouter = require('./userRouter')
const guideRouter = require('./guideRouter')
const toursRouter = require('./toursRouter')
const mappointRouter = require('./mappointRouter')
const topicsRouter = require('./topicsRouter')
const topicCommentsRouter = require('./topicCommentsRouter')
const tableUpdates = require('./tableUpdatesRouter')
const topicsCategory = require('./topicsCategiryRouter')
const toursCategory = require('./toursCategiryRouter')
const toursType = require('./toursTypeRouter')

router.use('/user',userRouter)
router.use('/guide',guideRouter)
router.use('/tours',toursRouter)
router.use('/mappoint',mappointRouter)
router.use('/topics',topicsRouter)
router.use('/topiccomment',topicCommentsRouter)
router.use('/tableupdates',tableUpdates)
router.use('/topicscategory',topicsCategory)
router.use('/tourscategory',toursCategory)
router.use('/tourstype',toursType)

module.exports = router