const {TableUpdates, Topics, Files, User, TopicsCategory} = require("../models/models");
const ApiError = require("../error/ApiError");
const fs = require("fs");
const path = require("path");
const {Op} = require("sequelize");
const {createNewFile} = require("../utils/consts.js");
const {reWrightFile, readFile, removeFile} = require("../utils/consts");

const removeTopicsCountFromCategories = (removeArr) => {
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
            } = req.body

            let img
            if (req.files) {
                img = req.files.img
            }


            if (name && created_by_user_id) {
                const result = createNewFile(dataText, 'Topics', img)

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
                            active: active,
                            created_by_user_id: created_by_user_id,
                            created_date: created_date,
                            deleted_by_user_id: deleted_by_user_id,
                            deleted_date: deleted_date,
                            file_name: fileName,
                        })

                        /**
                         Обновление таблиц
                         **/
                        try {
                            await TableUpdates.upsert({table_name: 'Topics', date: Date.now()})

                            const tagsArr = JSON.parse(tag)
                            await addTopicsCountToCategories(tagsArr)

                            // tagsArr.map(topicCatId => {
                            //     const topicCategoryItem = TopicsCategory.findOne({where: {id: topicCatId}})
                            //     if (topicCategoryItem) {
                            //
                            //         const topicsCount = topicCategoryItem.topics_count + 1 || 1
                            //         // topicCategoryItem.topics_count = topicsCount;
                            //         // topicCategoryItem.save();
                            //
                            //         TopicsCategory.update({
                            //             topics_count: topicsCount,
                            //         }, {where: {id: topicCatId}})
                            //     }
                            // })

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
            return res.json({status: 'error', message: e.message})

            // return next(ApiError.forbidden("Ошибка добавления..."))
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
                created_date,
                deleted_by_user_id,
                deleted_date,
                dataText,
            } = req.body

            let img
            if (req.files) {
                img = req.files.img
            }

            if (id && name && created_by_user_id) {

                const candidate = await Topics.findOne({where: {id}})

                if (candidate) {
                    const result = reWrightFile(dataText, 'Topics', candidate.file_name, null)

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

                            // diffAdd.map(topicCatId => {
                            //     const topicCategoryItem = TopicsCategory.findOne({where: {id: topicCatId}})
                            //     if (topicCategoryItem) {
                            //         const topicsCount = topicCategoryItem.topics_count + 1 || 1
                            //
                            //         TopicsCategory.update({
                            //             topics_count: topicsCount,
                            //         }, {where: {id: topicCatId}})
                            //     }
                            // })


                            let imgFileName = ''
                            try {
                                if (img) {
                                    imgFileName = candidate.file_name.split('\\')[1]
                                    await img.mv(path.resolve(__dirname, '..', "static", imgFileName))
                                }
                            } catch (e) {
                                return res.json({status: 'error', message: 'save image error', e: e.message})
                            }

                            await Topics.update({
                                name: name,
                                description: description,
                                tag: tag,
                                images: images,
                                videos: videos,
                                google_map_url: google_map_url,
                                active: active,
                                created_by_user_id: created_by_user_id,
                                created_date: created_date,
                                deleted_by_user_id: deleted_by_user_id,
                                deleted_date: deleted_date
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
                                // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'User' }})
                                await TableUpdates.upsert({table_name: 'Topics', date: Date.now()})

                                const tagsArr = JSON.parse(tag)
                                tagsArr.map(topicCatId => {
                                    const topicCategoryItem = TopicsCategory.findOne({where: {id: topicCatId}})
                                    if (topicCategoryItem) {

                                        const topicsCount = topicCategoryItem.topics_count + 1 || 1
                                        // topicCategoryItem.topics_count = topicsCount;
                                        // topicCategoryItem.save();

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

    async getTopicData(req, res, next) {
        const {id, user_id = -1} = req.query
        try {
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

                                const currUser = await User.findOne({
                                    attributes: {exclude: ['password']},
                                    where: {id: candidate.created_by_user_id}
                                })


                                topicData.name = candidate.name
                                topicData.description = candidate.description
                                topicData.categories = candidate.tag
                                // image_logo: {type: DataTypes.STRING, allowNull: false},
                                // images: {type: DataTypes.STRING},
                                // videos: {type: DataTypes.STRING},
                                // google_map_url: {type: DataTypes.STRING},
                                topicData.active = candidate.active
                                // created_by_user_id: {type: DataTypes.INTEGER},
                                topicData.created_date = candidate.created_date
                                // deleted_by_user_id: {type: DataTypes.INTEGER},
                                // deleted_date: {type: DataTypes.BIGINT},
                                topicData.image = candidate.file_name
                                topicData.userName = currUser.name

                                if ('' + candidate.created_by_user_id === '' + user_id) {
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
                return next(ApiError.internal("Topic not found"))

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
            const {tag_search, sort_code} = req.query
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
                            [Op.like]: '%' + tagSearch + '%'
                        }
                    }
                }
            )

            let newRows = []

            const usersArr = await User.findAll()

            topicsCategoriesList.rows.map(item => {
                let newItem = JSON.parse(JSON.stringify(item))

                usersArr.map(currUser => {
                    if (currUser.id === item.created_by_user_id) {
                        newItem.created_by_user_name = currUser.name
                        newRows.push(newItem)
                    }
                })
            })

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
                        let imgFileName = candidate.file_name.split('\\')[1]
                        const imgFilePath = path.resolve(__dirname, '..', "static", imgFileName)
                        fs.unlinkSync(imgFilePath)
                    } catch (e) {
                    }

                    const result = removeFile(candidate.file_name)
                    if (result.hasOwnProperty('status')) {
                        if (result.status === 'ok') {

                            const tagsArr = JSON.parse(candidate.tag)
                            await removeTopicsCountFromCategories(tagsArr)
                            // await tagsArr.map(topicCatId => {
                            //     const topicCategoryItem = TopicsCategory.findOne({where: {id: topicCatId}})
                            //     if (topicCategoryItem) {
                            //         const topicsCount = topicCategoryItem.topics_count - 1 || 0
                            //         TopicsCategory.update({
                            //             topics_count: topicsCount,
                            //         }, {where: {id: topicCatId}})
                            //         if(topicCategoryItem.topics_count > 0) {
                            //             topicCategoryItem.topics_count = topicsCount;
                            //             topicCategoryItem.save();
                            //         }
                            //     }
                            //
                            // })


                            await Files.destroy({where: {table_name: 'Topics', file_name: candidate.file_name}})
                            const count = await Topics.destroy({where: {id: id}})
                            return res.json({status: "ok", message: `Удалено записей: ${count}`})
                        }
                    }
                }
            }
        } catch (e) {
            return res.json({status: "error", message: e.message})
        }
        return next(ApiError.internal("Ошибка удаления"))

    }

}


module.exports = new TopicsController()