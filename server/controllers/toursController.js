const {TableUpdates, User, Tours, Files} = require("../models/models");
const {Op} = require("sequelize");
const ApiError = require("../error/ApiError");
const path = require("path");
const fs = require("fs");
const {removeFile, createNewFile} = require("../utils/consts");

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
            if (req.files) {
                img = req.files.img
            }

            if (name && created_by_user_admin_id) {
                const result = await createNewFile('', 'Tours', img)


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
                        })

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
            } = req.body

            let img
            if (req.files) {
                img = req.files.img
            }

            if (id && name && created_by_user_id) {

                const candidate = await Tours.findOne({where: {id}})

                if (candidate) {
                    // const result = reWrightFile('', 'Tours', candidate.file_name, null)
                    //
                    // if (result.hasOwnProperty('status')) {
                    //     if (result.status === 'ok') {

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
                    // }
                    // }

                }
            } else {
                return next(ApiError.forbidden("Необходимо указать все данные..."))
            }
        } catch (e) {
            return res.json({status: 'error', message: e.message})

        }
        return next(ApiError.forbidden("Ошибка изменения..."))

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
                            [Op.like]: '%' + tagSearch + '%'
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