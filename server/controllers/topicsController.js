const {TableUpdates, Topics, Files, User, TopicsCategory, TopicComments} = require("../models/models");
const ApiError = require("../error/ApiError");
const fs = require("fs");
const path = require("path");
const {Op} = require("sequelize");
const {
    createNewFile, reWrightFile, readFile, removeFile, getFreeFileName, getDirName,
    resizeImageWithThumb
} = require("../utils/consts");

const removeTopicsCountFromCategories = (removeArr) => {
    try {
        if (removeArr) {
            removeArr.map(topicCatId => {
                const topicCategoryItem = TopicsCategory.findOne({where: {id: topicCatId}})
                if (topicCategoryItem) {
                    const topicsCount = topicCategoryItem.topics_count - 1 || 0
                    TopicsCategory.update({
                        topics_count: topicsCount,
                    }, {where: {id: topicCatId}})
                    if (topicCategoryItem.topics_count > 0) {
                        topicCategoryItem.topics_count = topicsCount;
                        topicCategoryItem.save();
                    }
                }

            })
        }
    } catch (e) {
        console.log(e.message)
    }
}

const saveTopicImageFile = (dataText, newImagesArr, topicId) => {
    let dataText_json = JSON.parse(dataText)

    for (let i = 0; i < dataText_json.length; i++) {
        let item = dataText_json[i]
        if (item.hasOwnProperty('type')) {
            if (item.type === 'images') {

                let imagesArr = JSON.parse(item.items)
                const arrIndex = item.index

                newImagesArr.map(function (image) {

                    const imageArrIndex = image.name.substring(image.name.lastIndexOf(" ") + 1, image.name.length);
                    let imageArrName = image.name.replace(' ' + imageArrIndex, '')

                    imagesArr = imagesArr.filter(function (value) {
                        return value !== imageArrName;
                    })

                    if (("" + imageArrIndex) === (arrIndex + "")) {

                        const md5 = image.md5
                        let dirName = getDirName('img')
                        const fileName = getFreeFileName(dirName)
                        const imgFileName = fileName.substring(fileName.lastIndexOf("/") + 1, fileName.length);
                        image.mv(path.resolve(__dirname, '..', "static", imgFileName + '_orig')).then()

                        imagesArr.push(imgFileName)

                        Files.create({
                            table_name: 'Topic ' + topicId,
                            file_name: fileName,
                            md5
                        }).then(() => {

                            try {
                                resizeImageWithThumb(fileName)
                            } catch (e) {
                                console.log('e', e.message)
                            }

                        })


                    }
                })
                item.items = JSON.stringify(imagesArr)
            }
        }
        dataText_json[i] = item
    }

    return JSON.stringify(dataText_json)
}

const addTopicsCountToCategories = (addArr) => {

    if (addArr) {
        addArr.map(topicCatId => {
            const topicCategoryItem = TopicsCategory.findOne({where: {id: topicCatId}})
            if (topicCategoryItem) {
                const topicsCount = topicCategoryItem.topics_count + 1 || 1

                TopicsCategory.update({
                    topics_count: topicsCount,
                }, {where: {id: topicCatId}})
            }
        })
    }

}

class TopicsController {

    async create(req, res, next) {

        try {
            const {
                name,
                description,
                tag,
                images,
                videos,
                google_map_url,
                active,
                created_by_user_id,
                created_date,
                deleted_by_user_id,
                deleted_date,
                dataText,
                new_images_count,
            } = req.body

            let activeAdmin = active
            if (typeof active != "boolean") {
                activeAdmin = (active?.toLowerCase?.() === 'true');
            }

            let created_by_user_admin_id = created_by_user_id
            const currUser = req.user
            let userAdmin = null
            try {
                if (currUser) {
                    userAdmin = await User.findOne({where: {id: currUser.id}})
                    created_by_user_admin_id = userAdmin.id
                } else {
                    return next(ApiError.forbidden("Не авторизован"))
                }
            } catch (e) {
            }

            let img
            let newImagesArr = []
            if (req.files) {
                img = req.files.img

                if (new_images_count) {
                    if (new_images_count > 0) {
                        for (let i = 0; i < new_images_count; i++) {
                            const newImg = req.files['img' + i]
                            newImagesArr.push(newImg)
                        }
                    }
                }
            }

            if (name && created_by_user_admin_id) {

                const result = await createNewFile(dataText, 'Topics', img)

                if (result.hasOwnProperty('status')) {
                    if (result.status === 'ok') {

                        const fileName = result.fileName
                        let imgFileName = ''
                        if (result.imgFileName) {
                            imgFileName = result.imgFileName
                        }

                        const newTopic = await Topics.create({
                            name: name,
                            description: description,
                            tag: tag,
                            image_logo: imgFileName,
                            images: images,
                            videos: videos,
                            google_map_url: google_map_url,
                            active: activeAdmin,
                            created_by_user_id: created_by_user_admin_id,
                            created_date: created_date,
                            deleted_by_user_id: deleted_by_user_id,
                            deleted_date: deleted_date,
                            file_name: fileName,
                        })

                        try {
                            if (new_images_count > 0) {
                                const newDataText = saveTopicImageFile(dataText, newImagesArr, newTopic.id)// create
                                await reWrightFile(newDataText, 'Topics', newTopic.file_name, null)
                            }
                        } catch (e) {
                            console.log(e)
                        }

                        /**
                         Обновление таблиц
                         **/
                        try {
                            await TableUpdates.upsert({table_name: 'Topics', date: Date.now()})

                            const tagsArr = JSON.parse(tag)
                            await addTopicsCountToCategories(tagsArr)

                        } catch (e) {
                        }

                        try {
                            if (img) {
                                return res.json({status: 'ok', id: newTopic.id, 'image_logo': imgFileName})
                            }
                        } catch (e) {
                        }

                        return res.json({status: 'ok', id: newTopic.id})

                    } else {
                        return res.json({status: 'error', message: result.message})
                    }
                }
                return res.json({status: 'error', message: 'Create file error'})


            } else {
                return next(ApiError.forbidden("Необходимо указать все данные..."))
            }
        } catch (e) {
            console.log(e.message)
            return res.json({status: 'error', message: e.message})
        }
    }

    async change(req, res, next) {

        try {
            const {
                id,
                name,
                description,
                tag,
                images,
                videos,
                google_map_url,
                active,
                created_by_user_id,
                // created_date = 0,
                deleted_by_user_id,
                deleted_date = 0,
                dataText,
                new_images_count,
            } = req.body

            let created_by_user_admin_id = created_by_user_id
            const currUser = req.user
            let userAdmin = null
            try {
                if (currUser) {
                    userAdmin = await User.findOne({where: {id: currUser.id}})
                    created_by_user_admin_id = userAdmin.id
                } else {
                    return next(ApiError.forbidden("Не авторизован"))
                }
            } catch (e) {
            }

            let img
            let newImagesArr = []
            if (req.files) {
                img = req.files.img

                if (new_images_count) {
                    if (new_images_count > 0) {
                        for (let i = 0; i < new_images_count; i++) {
                            const newImg = req.files['img' + i]
                            newImagesArr.push(newImg)
                        }
                    }
                }
            }

            if (id && name && created_by_user_admin_id) {

                const candidate = await Topics.findOne({where: {id}})

                if (candidate) {
                    let newDataText = dataText

                    const readFileResult = readFile(candidate.file_name)
                    if (readFileResult.hasOwnProperty('status')) {
                        if (readFileResult.status === 'ok') {
                            let topicFileData = JSON.parse(readFileResult.data)
                            let newTopicFileData = JSON.parse(dataText)

                            let topicDataImages = []
                            let newTopicDataImages = []

                            topicFileData.map(function (item) {
                                if (item.hasOwnProperty('type')) {
                                    if (item.type === 'images') {
                                        topicDataImages = [...topicDataImages, ...JSON.parse(item.items)]
                                    }
                                }
                            })

                            newTopicFileData.map(function (item) {
                                if (item.hasOwnProperty('type')) {
                                    if (item.type === 'images') {
                                        newTopicDataImages = [...newTopicDataImages, ...JSON.parse(item.items)]
                                    }
                                }
                            })

                            const res = topicDataImages.filter(item => !newTopicDataImages.includes(item));

                            res.map(async currImageForDelete => {
                                /** Grab image of topic data **/
                                const topicDataImage_db = await Files.findAll({
                                    where: {
                                        table_name: 'Topic ' + id,
                                        file_name: 'static/' + currImageForDelete,
                                    }
                                })
                                /** Remove images of topic data from drive **/
                                topicDataImage_db.map(item => {
                                    removeFile(item.file_name)
                                    removeFile(item.file_name + '_s')
                                    removeFile(item.file_name + '_th')
                                })
                                /** Remove images of topic data from DB **/
                                await Files.destroy({
                                    where: {
                                        table_name: 'Topic ' + id,
                                        file_name: 'static/' + currImageForDelete,
                                    }
                                })
                            })

                        }
                    }

                    try {
                        if (new_images_count > 0) {
                            newDataText = saveTopicImageFile(dataText, newImagesArr, candidate.id)// change
                        }
                    } catch (e) {
                        console.log(e)
                    }

                    const result = await reWrightFile(newDataText, 'Topics', candidate.file_name, null)

                    if (result.hasOwnProperty('status')) {
                        if (result.status === 'ok') {

                            const tagsArr = JSON.parse(tag)
                            const candidateTagsArr = JSON.parse(candidate.tag)

                            const diffAdd = function (tagsArr, candidateTagsArr) {
                                return tagsArr.filter(i => candidateTagsArr.indexOf(i) < 0)
                            }
                            const diffDelete = function (tagsArr, candidateTagsArr) {
                                return candidateTagsArr.filter(i => tagsArr.indexOf(i) < 0)
                            }

                            await addTopicsCountToCategories(diffAdd(tagsArr, candidateTagsArr))
                            await removeTopicsCountFromCategories(diffDelete(tagsArr, candidateTagsArr))

                            let imgFileName = ''
                            try {
                                if (img) {
                                    imgFileName = candidate.file_name.substring(candidate.file_name.lastIndexOf("/") + 1, candidate.file_name.length);
                                    await img.mv(path.resolve(__dirname, '..', "static", imgFileName + '_orig'))
                                    removeFile('static/' + imgFileName)
                                    removeFile('static/' + imgFileName + '_s')
                                    removeFile('static/' + imgFileName + '_th')

                                    resizeImageWithThumb('static/' + imgFileName)
                                }
                            } catch (e) {
                                return res.json({
                                    status: 'error',
                                    message: 'save image error',
                                    e: e.message,
                                    imgFileName: "" + candidate.file_name
                                })
                            }

                            await Topics.update({
                                name: name,
                                description: description,
                                tag: tag,
                                images: images,
                                videos: videos,
                                google_map_url: google_map_url,
                                active: active,
                                // created_by_user_id: created_by_user_admin_id,
                                // created_date: BigInt(created_date),
                                deleted_by_user_id: deleted_by_user_id,
                                deleted_date: BigInt(deleted_date)
                            }, {where: {id: id}})


                            try {
                                if (img) {
                                    await Topics.update({
                                        image_logo: imgFileName,
                                    }, {where: {id: id}})
                                }
                            } catch (e) {
                            }

                            /**
                             Обновление таблиц
                             **/
                            try {
                                await TableUpdates.upsert({table_name: 'Topics', date: Date.now()})

                                const tagsArr = JSON.parse(tag)
                                tagsArr.map(topicCatId => {
                                    const topicCategoryItem = TopicsCategory.findOne({where: {id: topicCatId}})
                                    if (topicCategoryItem) {

                                        const topicsCount = topicCategoryItem.topics_count + 1 || 1

                                        TopicsCategory.update({
                                            topics_count: topicsCount,
                                        }, {where: {id: topicCatId}})
                                    }
                                })

                            } catch (e) {
                            }

                            try {
                                if (img) {
                                    return res.json({status: 'ok', 'image_logo': imgFileName})
                                }
                            } catch (e) {
                            }

                            return res.json({status: 'ok'})
                        }
                    }

                }
            } else {
                return next(ApiError.forbidden("Необходимо указать все данные..."))
            }
        } catch (e) {
            return res.json({status: 'error', message: e.message})

        }
        return next(ApiError.forbidden("Ошибка изменения..."))
    }

    async getTopicCanEdit(req, res, next) {
        const {id} = req.query
        const currUser = req.user

        try {
            if (Number.isInteger(parseInt(id))) {

                if (!id) {
                    return next(ApiError.badRequest("Ошибка параметра"))
                } else {
                    const candidate = await Topics.findOne({where: {id}})

                    if (candidate) {
                        try {
                            if (currUser !== null && currUser !== undefined) {
                                if (currUser.id === candidate.created_by_user_id) {
                                    return res.json({status: 'ok'})
                                }
                            }
                        } catch (e) {
                        }
                    }
                    return res.json({status: 'no'})

                }
            } else {
                return res.json({status: 'error', message: 'topic not found'})
            }
        } catch (e) {
            return next(ApiError.internal(e.message))
        }
    }

    async getTopicData(req, res, next) {
        const {id, user_id = -1} = req.query
        const currUser = req.user


        try {
            if (Number.isInteger(parseInt(id))) {

                if (!id) {
                    return next(ApiError.badRequest("Ошибка параметра"))
                } else {
                    const candidate = await Topics.findOne({where: {id}})

                    if (candidate) {
                        try {
                            const readFileResult = readFile(candidate.file_name)
                            if (readFileResult.hasOwnProperty('status')) {
                                if (readFileResult.status === 'ok') {
                                    let topicFileData = JSON.parse(readFileResult.data)
                                    let topicData = {}

                                    const topicUser = await User.findOne({
                                        attributes: {exclude: ['password']},
                                        where: {id: candidate.created_by_user_id}
                                    })

                                    topicData.commentsCount = await TopicComments.count({
                                        where: {
                                            topic_id: candidate.id,
                                        },
                                    })

                                    if (currUser !== null && currUser !== undefined) {
                                        if (currUser.id === candidate.created_by_user_id) {
                                            topicData.editable = true
                                        }
                                    }

                                    topicData.image = candidate.image_logo

                                    topicData.name = candidate.name
                                    topicData.description = candidate.description
                                    topicData.categories = candidate.tag
                                    topicData.seen = candidate.seen
                                    // image_logo: {type: DataTypes.STRING, allowNull: false},
                                    // images: {type: DataTypes.STRING},
                                    // videos: {type: DataTypes.STRING},
                                    // google_map_url: {type: DataTypes.STRING},
                                    // topicData.active = candidate.active
                                    // created_by_user_id: {type: DataTypes.INTEGER},
                                    topicData.created_date = candidate.created_date
                                    // deleted_by_user_id: {type: DataTypes.INTEGER},
                                    // deleted_date: {type: DataTypes.BIGINT},
                                    // topicData.image = candidate.file_name
                                    topicData.userName = topicUser.name
                                    topicData.userId = topicUser.id

                                    if (candidate.created_by_user_id === user_id) {
                                        topicFileData.editable = true
                                    }

                                    topicData.data = topicFileData
                                    return res.json(JSON.stringify(topicData))
                                }
                            }
                        } catch (e) {
                        }
                        return next(ApiError.internal("Ошибка чтения данных файла"))
                    }
                    return res.json({status: 'error', message: 'Topic not found'})
                    // return next(ApiError.internal("Topic not found"))

                }
            } else {
                return res.json({status: 'error', message: 'topic not found'})
            }
        } catch (e) {
            return next(ApiError.internal(e.message))
        }
    }

    async getData(req, res, next) {
        const {id} = req.params
        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        } else {
            const candidate = await Topics.findOne({where: {id}})

            if (candidate) {
                return res.json(readFile(candidate.file_name))
            }
        }
        return next(ApiError.internal("Ошибка чтения данных файла"))

    }

    async getAll(req, res, next) {
        try {
            const {category_id, tag_search, sort_code} = req.query
            let sortOrder = ['id', 'ASC']

            switch (sort_code) {
                case 'user':
                    sortOrder = ['created_by_user_id', 'ASC']
                    break
                case 'reuser':
                    sortOrder = ['created_by_user_id', 'DESC']
                    break
                case 'date':
                    sortOrder = ['created_date', 'ASC']
                    break
                case 'redate':
                    sortOrder = ['created_date', 'DESC']
                    break
                case 'id':
                    sortOrder = ['id', 'ASC']
                    break
                case 'reid':
                    sortOrder = ['id', 'DESC']
                    break
                case 'alpha':
                    sortOrder = ['name', 'ASC']
                    break
                case 'realpha':
                    sortOrder = ['name', 'DESC']
                    break
            }

            let topicsCategoriesList

            category_id
                ?
                topicsCategoriesList = await Topics.findAndCountAll({
                        // limit: 10,
                        order: [sortOrder],
                        where: {
                            active: true,
                            name: {
                                [Op.iLike]: '%' + tag_search + '%'
                            },
                            tag: {
                                [Op.like]: '%' + category_id + '%'
                            },
                        }
                    }
                )
                :
                topicsCategoriesList = await Topics.findAndCountAll({
                        // limit: 10,
                        order: [sortOrder],
                        where: {
                            active: true,
                            name: {
                                [Op.iLike]: '%' + tag_search + '%'
                            },
                        }
                    }
                )

            let newRows = []

            for (let i = 0; i < topicsCategoriesList.rows.length; i++) {
                const item = topicsCategoriesList.rows[i]

                let newItem = JSON.parse(JSON.stringify(item))


                const user = await User.findOne({where: {id: item.created_by_user_id}})
                if (!user) {
                    newItem.created_by_user_name = '-'
                } else {
                    newItem.created_by_user_name = user.name
                }

                // let imgFileName = ''
                // if(newItem.file_name.indexOf('/') !== -1) {
                //     imgFileName = newItem.file_name.substring(newItem.file_name.lastIndexOf("/") + 1, newItem.file_name.length);
                // }else{
                //     imgFileName = newItem.file_name
                // }
                // newItem.image = imgFileName

                newItem.image = newItem.image_logo

                newItem.commentsCount = await TopicComments.count({
                    where: {
                        topic_id: newItem.id,
                    },
                })

                // commentsCount
                // createdAt
                // created_by_user_name
                // description
                // image_logo
                // name
                // tag
                // delete newItem.id
                newItem.updatedAt = newItem.createdAt

                delete newItem.active
                delete newItem.image_logo
                delete newItem.created_by_user_id
                delete newItem.created_date
                delete newItem.deleted_by_user_id
                delete newItem.deleted_date
                delete newItem.file_name
                delete newItem.google_map_url
                delete newItem.images
                delete newItem.userId
                delete newItem.videos

                newRows.push(newItem)

            }

            return res.json({
                count: newRows.length,
                'rows': newRows
            })
        } catch (e) {
            // return res.json({'status': 'error', 'message': e.message})

            // return next(ApiError.internal("Ошибка параметра"))
            return next(ApiError.internal(e.message))
        }
    }

    async getAllAdmin(req, res, next) {
        try {
            const {tag_search, sort_code} = req.query
            const currUser = req.user

            let userAdmin = null
            try {
                if (currUser) {
                    userAdmin = await User.findOne({where: {id: currUser.id}})
                    if (!userAdmin.is_admin) {
                        return next(ApiError.forbidden("Не админимтратор"))
                    }
                }
            } catch (e) {
            }

            let sortOrder = ['id', 'ASC']

            let tagSearch = tag_search
            if (!tagSearch) {
                tagSearch = ''
            }

            switch (sort_code) {
                case 'user':
                    sortOrder = ['created_by_user_id', 'ASC']
                    break
                case 'reuser':
                    sortOrder = ['created_by_user_id', 'DESC']
                    break
                case 'date':
                    sortOrder = ['created_date', 'ASC']
                    break
                case 'redate':
                    sortOrder = ['created_date', 'DESC']
                    break
                case 'id':
                    sortOrder = ['id', 'ASC']
                    break
                case 'reid':
                    sortOrder = ['id', 'DESC']
                    break
            }

            const topicsCategoriesList = await Topics.findAndCountAll({
                    // limit: 10,
                    // attributes: ['tag', tagSearch],
                    order: [sortOrder
                        // ['id', 'ASC'],
                        // ['name', 'DESC'],
                        // ['name', 'ASC'],
                    ],
                    where: {
                        tag: {
                            [Op.iLike]: '%' + tagSearch + '%'
                        }
                    }
                }
            )

            let newRows = []

            for (let i = 0; i < topicsCategoriesList.rows.length; i++) {
                const item = topicsCategoriesList.rows[i]

                let newItem = JSON.parse(JSON.stringify(item))

                const user = await User.findOne({where: {id: item.created_by_user_id}})

                if (user) {
                    newItem.created_by_user_name = user.name
                } else {
                    newItem.created_by_user_name = '-'
                }

                newItem.commentsCount = await TopicComments.count({
                    where: {
                        topic_id: newItem.id,
                    },
                })

                // commentsCount
                // createdAt
                // created_by_user_name
                // description
                // image_logo
                // name
                // tag
                // delete newItem.id
                newItem.updatedAt = newItem.createdAt

                if (!userAdmin) {
                    delete newItem.created_date
                }

                delete newItem.active
                delete newItem.created_by_user_id
                delete newItem.deleted_by_user_id
                delete newItem.deleted_date
                delete newItem.file_name
                delete newItem.google_map_url
                delete newItem.images
                delete newItem.userId
                delete newItem.videos

                newRows.push(newItem)

            }

            return res.json({
                count: newRows.length,
                'rows': newRows
            })
        } catch (e) {
            // return res.json({'status': 'error', 'message': e.message})

            return next(ApiError.internal("Ошибка параметра"))
        }
    }

    async setActive(req, res, next) {
        const {id, active} = req.body

        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        } else {
            const candidate = await Topics.findOne({where: {id: id}})
            if (candidate) {
                await Topics.update(
                    {
                        active: active,
                    },
                    {
                        where: {id: id},
                    }
                );
                /**
                 Обновление таблиц
                 **/
                try {
                    await TableUpdates.upsert({table_name: 'Topics', date: Date.now()})
                } catch (e) {
                }

                return res.json({status: 'ok'})
            }
            return next(ApiError.badRequest("Ошибка установки параметра"))
        }
    }

    async setTopicSeen(req, res, next) {
        const {id} = req.body

        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        } else {
            const candidate = await Topics.findOne({where: {id: id}})
            if (candidate) {

                await Topics.increment('seen', {by: 1, where: {id: id}});

                return res.json({status: 'ok'})
            }
            return next(ApiError.badRequest("Ошибка установки параметра"))
        }
    }

    async getById(req, res) {

    }

    async getByUser(req, res) {

    }

    async deleteTopic(req, res, next) {
        const {id} = req.query
        try {
            if (!id) {
                return next(ApiError.badRequest("Ошибка параметра"))
            } else {
                /**
                 Обновление таблиц
                 **/
                try {
                    await TableUpdates.upsert({table_name: 'Topics', date: Date.now()})
                } catch (e) {
                }
                const candidate = await Topics.findOne({where: {id}})
                if (candidate) {

                    try {
                        /** Remove image_logo of topic from derive **/
                        const imgFileName = candidate.file_name.substring(candidate.file_name.lastIndexOf("/") + 1, candidate.file_name.length);
                        const imgFilePath = path.resolve(__dirname, '..', "static", imgFileName)
                        fs.unlinkSync(imgFilePath)
                    } catch (e) {
                    }

                    /** Remove topic data file **/
                    removeFile("data/" + candidate.file_name)

                    /** Remove all topic comments **/
                    await TopicComments.destroy({
                        where: {
                            topic_id: candidate.id
                        }
                    })

                    /** Remove data of topic count from categories **/
                    try {
                        const tagsArr = JSON.parse(candidate.tag)
                        await removeTopicsCountFromCategories(tagsArr)
                    } catch (e) {
                    }

                    /** Remove image_logo of topic from DB **/
                    try {
                        await Files.destroy({where: {table_name: 'Topics', file_name: candidate.file_name}})
                    } catch (e) {
                    }
                    /** Collect all images of topic data (topic.data type="images") **/
                    const topicDataImages = await Files.findAll({
                        where: {
                            table_name: 'Topic ' + id,
                        }
                    })
                    /** Remove all images of topic data from drive **/
                    topicDataImages.map(item => {
                        removeFile(item.file_name)
                        removeFile(item.file_name + '_s')
                        removeFile(item.file_name + '_th')

                    })

                    /** Remove all images of topic data from DB **/
                    await Files.destroy({
                        where: {
                            table_name: 'Topic ' + id,
                        }
                    })

                    /** Remove topic from DB **/
                    const count = await Topics.destroy({where: {id: id}})
                    return res.json({status: "ok", message: `Удалено записей: ${count}`})

                }
            }
        } catch (e) {
            return res.json({status: "error", message: e.message})
        }
        return next(ApiError.internal("Ошибка удаления"))

    }

}


module.exports = new TopicsController()