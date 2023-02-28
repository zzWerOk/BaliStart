const {TableUpdates, User, Tours, Files, Guide} = require("../models/models");
const {Op} = require("sequelize");
const ApiError = require("../error/ApiError");
const path = require("path");
const fs = require("fs");
const {removeFile, createNewFile, reWrightFile, readFile, getDirName, getFreeFileName} = require("../utils/consts");

const saveTourImageFile = (dataText, newImagesArr, tourId) => {
    let dataText_json = JSON.parse(dataText)

    if (dataText_json.hasOwnProperty('images')) {
        let item = dataText_json['images']
        let imagesArr = JSON.parse(item)

        newImagesArr.map(function (image) {
            let imageArrName = image.name

            imagesArr = imagesArr.filter(function (value) {
                return value !== imageArrName;
            })

            const md5 = image.md5
            let dirName = getDirName('img')
            const fileName = getFreeFileName(dirName)
            const imgFileName = fileName.substring(fileName.lastIndexOf("/") + 1, fileName.length);
            image.mv(path.resolve(__dirname, '..', "static", imgFileName)).then()

            imagesArr.push(imgFileName)

            Files.create({
                table_name: 'Tour ' + tourId,
                file_name: fileName,
                md5
            }).then()
        })
        item = JSON.stringify(imagesArr)
        dataText_json['images'] = item
    }
    return JSON.stringify(dataText_json)
}

class ToursController {

    async create(req, res, next) {
        try {
            const {
                name,
                description,
                image_logo,
                created_by_user_id,
                created_date,
                active,
                tour_category,
                tour_type,
                duration,
                activity_level,
                languages,
                map_points,
                selected_guides,
                guide_can_add,
                data,
                new_images_count,
                price_usd,
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

            if (name && created_by_user_admin_id) {
                const result = await createNewFile(data, 'Tours', img)

                if (result.hasOwnProperty('status')) {
                    if (result.status === 'ok') {
                        const fileName = result.fileName
                        let imgFileName = ''
                        if (result.imgFileName) {
                            imgFileName = result.imgFileName
                        }

                        const newTour = await Tours.create({
                            name,
                            description,
                            image_logo,
                            created_by_user_id: created_by_user_admin_id,
                            created_date,
                            active,
                            tour_category,
                            tour_type,
                            duration,
                            activity_level,
                            languages,
                            map_points,
                            file_name: fileName,
                            selected_guides,
                            guide_can_add,
                            price_usd,
                        })

                        try {
                            if (new_images_count > 0) {
                                const newDataText = saveTourImageFile(data, newImagesArr, newTour.id)// create
                                await reWrightFile(newDataText, 'Tours', newTour.file_name, null)
                            }
                        } catch (e) {
                            console.log(e)
                        }

                        /**
                         Обновление таблиц
                         **/
                        try {
                            await TableUpdates.upsert({table_name: 'Tours', date: Date.now()})
                        } catch (e) {
                        }

                        try {
                            if (img) {
                                return res.json({status: 'ok', id: newTour.id, 'image_logo': imgFileName})
                            }
                        } catch (e) {
                        }

                        return res.json({status: 'ok', id: newTour.id})
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
                image_logo,
                created_by_user_id,
                created_date,
                active,
                tour_category,
                tour_type,
                duration,
                activity_level,
                languages,
                map_points,
                data,
                new_images_count,
                selected_guides,
                guide_can_add,
                price_usd,
            } = req.body


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

            if (id && name && created_by_user_id) {

                const candidate = await Tours.findOne({where: {id}})

                if (candidate) {

                    let newDataText = data

                    const readFileResult = readFile(candidate.file_name)

                    if (readFileResult.hasOwnProperty('status')) {
                        if (readFileResult.status === 'ok') {
                            let tourFileData = JSON.parse(readFileResult.data)
                            let newTourFileData = JSON.parse(data)

                            let topicDataImages = []
                            let newTopicDataImages = []

                            if (tourFileData.hasOwnProperty('images')) {
                                // topicDataImages = [...topicDataImages, ...JSON.parse(tourFileData['images'])]
                                topicDataImages = JSON.parse(tourFileData['images'])
                            }

                            if (newTourFileData.hasOwnProperty('images')) {
                                // newTopicDataImages = [...newTopicDataImages, ...JSON.parse(newTourFileData['images'])]
                                newTopicDataImages = JSON.parse(newTourFileData['images'])
                            }

                            const res = topicDataImages.filter(item => !newTopicDataImages.includes(item));

                            res.map(async currImageForDelete => {
                                /** Grab image of tour data **/
                                const topicDataImage_db = await Files.findAll({
                                    where: {
                                        table_name: 'Tour ' + id,
                                        file_name: 'static/' + currImageForDelete,
                                    }
                                })
                                /** Remove images of tour data from drive **/
                                topicDataImage_db.map(item => {
                                    removeFile(item.file_name)
                                })
                                /** Remove images of tour data from DB **/
                                await Files.destroy({
                                    where: {
                                        table_name: 'Tour ' + id,
                                        file_name: 'static/' + currImageForDelete,
                                    }
                                })
                            })

                        }
                    }

                    try {
                        if (new_images_count > 0) {
                            newDataText = saveTourImageFile(data, newImagesArr, candidate.id)// change
                        }
                    } catch (e) {
                        console.log(e)
                    }

                    const result = await reWrightFile(newDataText, 'Topics', candidate.file_name, null)

                    // const result = await reWrightFile(data, 'Tours', candidate.file_name)

                    if (result.hasOwnProperty('status')) {
                        if (result.status === 'ok') {

                            let imgFileName = ''
                            try {
                                if (img) {
                                    // imgFileName = candidate.file_name.split('\\')[1]
                                    imgFileName = candidate.file_name.substring(candidate.file_name.lastIndexOf("/") + 1, candidate.file_name.length);
                                    await img.mv(path.resolve(__dirname, '..', "static", imgFileName))
                                }
                            } catch (e) {
                                return res.json({status: 'error', message: 'save image error', e: e.message})
                            }

                            await Tours.update({
                                name,
                                description,
                                image_logo,
                                created_by_user_id,
                                created_date,
                                active,
                                tour_category,
                                tour_type,
                                duration,
                                activity_level,
                                languages,
                                map_points,
                                selected_guides,
                                guide_can_add,
                                price_usd,
                            }, {where: {id: id}})

                            try {
                                if (img) {
                                    await Tours.update({
                                        image_logo: imgFileName,
                                    }, {where: {id: id}})
                                }
                            } catch (e) {
                            }

                            /**
                             Обновление таблиц
                             **/
                            try {
                                await TableUpdates.upsert({table_name: 'Tours', date: Date.now()})
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

    async guidecanadd(req, res) {
        // const {tour_id} = req.query
        const {tour_id} = req.body

        try {

            if (tour_id) {
                const candidate = await Tours.findOne({where: {id: tour_id}})
                if (candidate) {
                    await Tours.update({
                        guide_can_add: !candidate.guide_can_add,
                    }, {where: {id: candidate.id}})
                    return res.json({status: 'ok'})
                }
            }
        } catch (e) {
            return res.json({status: 'error', message: e.message})
        }
        return res.json({status: 'error', message: 'Parameter error'})

    }


    async getAll(req, res, next) {
        try {
            const {tag_search, sort_code} = req.query
            let sortOrder = ['id', 'ASC']

            switch (sort_code) {
                case 'user':
                    sortOrder = ['created_by_user_id', 'ASC']
                    break
                case 'reuser':
                    sortOrder = ['created_by_user_id', 'DESC']
                    break
                case 'date':
                    sortOrder = ['updatedAt', 'ASC']
                    break
                case 'redate':
                    sortOrder = ['updatedAt', 'DESC']
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

            const toursList = await Tours.findAndCountAll({
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

            toursList.rows.map(item => {
                let newItem = JSON.parse(JSON.stringify(item))

                newItem.updatedAt = newItem.createdAt
                newItem.image = newItem.image_logo

                const currUser = User.findOne({where: {id: item.created_by_user_id}})
                newItem.created_by_user_name = currUser.name
                newRows.push(newItem)

                delete newItem.active
                delete newItem.created_by_user_id
                delete newItem.guide_can_add
                delete newItem.file_name
                delete newItem.created_date
                delete newItem.image_logo

            })

            return res.json({
                count: newRows.length,
                'rows': newRows
            })
        } catch (e) {
            return next(ApiError.internal("Ошибка параметра"))
        }
    }

    async getAllAdmin(req, res, next) {
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

            const toursList = await Tours.findAndCountAll({
                    // limit: 10,
                    // attributes: ['tag', tagSearch],
                    order: [sortOrder
                        // ['id', 'ASC'],
                        // ['name', 'DESC'],
                        // ['name', 'ASC'],
                    ],
                    where: {
                        tour_category: {
                            [Op.iLike]: '%' + tagSearch + '%'
                        }
                    }
                }
            )

            let newRows = []

            const usersArr = await User.findAll()

            toursList.rows.map(item => {
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

    async getById(req, res) {

    }

    async getData(req, res, next) {
        const {id} = req.params
        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        } else {
            const candidate = await Tours.findOne({where: {id}})

            if (candidate) {
                // let newRows = []

                let newItem = JSON.parse(JSON.stringify(candidate))

                // newItem.created_date = newItem.createdAt
                newItem.image = newItem.image_logo

                const currUser = await User.findOne({where: {id: candidate.created_by_user_id}})
                newItem.userName = currUser.name
                // newItem.created_by_user_name = currUser.name

                const selectedGuides = []
                const guidesIdsArr = JSON.parse(newItem.selected_guides)
                for (let i = 0; i < guidesIdsArr.length; i++) {
                    const currGuideId = guidesIdsArr[i]
                    const currUser = await User.findOne({
                        where: {id: currGuideId, is_guide: true, is_active: true},
                        attributes: {
                            exclude: ['password', 'updatedAt', 'is_admin', 'is_guide', 'is_active', 'date_last_login', 'createdAt'],
                        },
                    })

                    if (currUser) {
                        const currGuide = await Guide.findOne({
                            where: {user_id: currGuideId},
                            attributes: {
                                exclude: ['createdAt', 'updatedAt', 'visible_till', 'user_id', 'emergency_help_price', 'holidays', 'is_can_discount',
                                    'is_emergency_help', 'is_has_car', 'tours_ids', 'userId'],
                            },
                        })

                        if (currGuide) {
                            // let guideDataJson = JSON.parse(JSON.stringify(currGuide))
                            let guideDataJson = {}

                            const diff = Date.now() / 1000 - Number(currGuide.active_till)

                            if (diff < 0) {
                                guideDataJson.about = currGuide.about
                                guideDataJson.experience = currGuide.experience
                                guideDataJson.id = currUser.id
                                guideDataJson.languages = currGuide.languages
                                guideDataJson.name = currGuide.name
                                guideDataJson.phones = currGuide.phones
                                guideDataJson.links = currGuide.links
                                guideDataJson.religion = currGuide.religion
                                guideDataJson.avatar_img = currGuide.avatar_img
                                guideDataJson.email = currGuide.email
                                // guideDataJson.user_id = currGuide.user_id

                                if (!guideDataJson.email || guideDataJson.email === '') {
                                    guideDataJson.email = currUser.email
                                }

                                if (!guideDataJson.name || guideDataJson.name === '') {
                                    guideDataJson.name = currUser.name
                                }

                                if (!guideDataJson.avatar_img || guideDataJson.avatar_img === '') {
                                    guideDataJson.avatar_img = currUser.avatar_img
                                }

                                // delete guideDataJson.createdAt
                                // delete guideDataJson.updatedAt
                                // delete guideDataJson.visible_till
                                // delete guideDataJson.active_till
                                // delete guideDataJson.editable
                                // delete guideDataJson.user_id
                                // // delete guideDataJson.email
                                // delete guideDataJson.emergency_help_price
                                // delete guideDataJson.holidays
                                // delete guideDataJson.is_can_discount
                                // delete guideDataJson.is_emergency_help
                                // delete guideDataJson.is_has_car
                                // delete guideDataJson.tours_ids
                                // delete guideDataJson.userId


                                selectedGuides.push(guideDataJson)
                            }
                        }
                    }
                }

                newItem.selected_guides = selectedGuides

                const result = await readFile(candidate.file_name)
                if (result.hasOwnProperty('status')) {
                    if (result.status === 'ok') {
                        newItem.data = result.data
                    }
                }

                delete newItem.active
                delete newItem.created_by_user_id
                delete newItem.guide_can_add
                delete newItem.file_name
                // delete newItem.created_date
                delete newItem.updatedAt
                delete newItem.createdAt
                delete newItem.image_logo

                return res.json({
                    status: 'ok',
                    'data': newItem
                })

            }
        }
        return next(ApiError.internal("Ошибка чтения данных файла"))

    }

    async getByMapPoint(req, res) {

    }

    async deleteTour(req, res, next) {
        const {id} = req.query
        try {
            if (!id) {
                return next(ApiError.badRequest("Ошибка параметра"))
            } else {
                const candidate = await Tours.findOne({where: {id}})

                if (candidate) {

                    try {
                        // let imgFileName = candidate.file_name.split('\\')[1]
                        const imgFileName = candidate.file_name.substring(candidate.file_name.lastIndexOf("/") + 1, candidate.file_name.length);
                        const imgFilePath = path.resolve(__dirname, '..', "static", imgFileName)
                        fs.unlinkSync(imgFilePath)
                    } catch (e) {
                    }

                    /**
                     Обновление таблиц
                     **/
                    try {
                        await TableUpdates.upsert({table_name: 'Tours', date: Date.now()})
                    } catch (e) {
                    }

                    const result = removeFile("data/" + candidate.file_name)
                    if (result.hasOwnProperty('status')) {
                        if (result.status === 'ok') {
                            await Files.destroy({where: {table_name: 'Tours', file_name: candidate.file_name}})
                            const count = await Tours.destroy({where: {id: id}})
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

module.exports = new ToursController()