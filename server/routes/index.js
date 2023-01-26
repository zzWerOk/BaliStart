const Router = require('express')

const router = new Router()

const userRouter = require('./userRouter')
const guideRouter = require('./guideRouter')
const toursRouter = require('./toursRouter')
const mappointRouter = require('./mappointRouter')
const topicsRouter = require('./topicsRouter')
const tableUpdates = require('./tableUpdatesRouter')
const topicsCategory = require('./topicsCategiryRouter')
const toursCategory = require('./toursCategiryRouter')

router.use('/user',userRouter)
router.use('/guide',guideRouter)
router.use('/tours',toursRouter)
router.use('/mappoint',mappointRouter)
router.use('/topics',topicsRouter)
router.use('/tableupdates',tableUpdates)
router.use('/topicscategory',topicsCategory)
router.use('/tourscategory',toursCategory)


module.exports = router