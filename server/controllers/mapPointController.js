const {TableUpdates, MapPoint, User, Files} = require("../models/models");
const ApiError = require("../error/ApiError");
const {createNewFile, readFile, reWrightFile, removeFile} = require("../utils/consts");
const path = require("path");
const fs = require("fs");
const {Op} = require("sequelize");

class MapPointController {

    async create(req, res, next) {
        try {

            const {
                name,
                description,
                types,
                // google_map_url,
                // topics = '[]',
                active,
                created_by_user_id,
                data_text = '',
            } = req.body

            // return res.json({status: 'error', message: 'ssss'})

            const created_date = Date.now()

            let img
            if (req.files) {
                img = req.files.img
            }

            if (name) {

                const result = await createNewFile(data_text, 'MapPoint', img)

                if (result.hasOwnProperty('status')) {
                    if (result.status === 'ok') {
                        const fileName = result.fileName
                        let imgFileName = ''
                        if (result.imgFileName) {
                            imgFileName = result.imgFileName
                        }

                        const newMapPoint = await MapPoint.create({
                            name: name,
                            description: description,
                            image_logo: imgFileName,
                            types,
                            // google_map_url: google_map_url,
                            // topics: topics,
                            active: active,
                            created_by_user_id: created_by_user_id,
                            created_date: created_date,
                            file_name: fileName,
                        })

                        /**
                         Обновление таблиц
                         **/
                        try {
                            // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'MapPoint' }})
                            await TableUpdates.upsert({table_name: 'MapPoint', date: Date.now()})
                        } catch (e) {
                        }

                        try {
                            if (img) {
                                return res.json({status: 'ok', id: newMapPoint.id, 'image_logo': imgFileName})
                            }
                        } catch (e) {
                        }

                        return res.json({status: 'ok', id: newMapPoint.id})
                    } else {
                        return res.json({status: 'error', message: result.message})
                    }

                }
                return res.json({status: 'error', message: 'Create file error'})

            }
        } catch (e) {
            return next(ApiError.forbidden("Ошибка добавления точки интереса"))
        }
    }

    async change(req, res, next) {
        try {
            const {
                id,
                name,
                description,
                types,
                // google_map_url,
                // topics = '[]',
                active,
                created_by_user_id,
                data_text = '',
            } = req.body

            let img
            if (req.files) {
                img = req.files.img
            }

            if (id && name && created_by_user_id) {

                const candidate = await MapPoint.findOne({where: {id}})

                if (candidate) {
                    const result = await reWrightFile(data_text, 'MapPoint', candidate.file_name, null)

                    if (result.hasOwnProperty('status')) {
                        if (result.status === 'ok') {

                            let imgFileName = ''
                            try {
                                if (img) {
                                    if (process.platform === 'win32') {
                                        imgFileName = candidate.file_name.substring(candidate.file_name.lastIndexOf("\\") + 1, candidate.file_name.length);
                                    }else{
                                        imgFileName = candidate.file_name.substring(candidate.file_name.lastIndexOf("/") + 1, candidate.file_name.length);
                                    }

                                    await img.mv(path.resolve(__dirname, '..', "static", imgFileName))
                                }
                            } catch (e) {
                                return res.json({status: 'error', message: 'save image error', e: e.message})
                            }

                            await MapPoint.update({
                                name: name,
                                description: description,
                                types,
                                // google_map_url: google_map_url,
                                // topics: topics,
                                active: active,
                            }, {where: {id: id}})

                            try {
                                if (img) {
                                    await MapPoint.update({
                                        image_logo: imgFileName,
                                    }, {where: {id: id}})
                                }
                            } catch (e) {
                            }

                            /**
                             Обновление таблиц
                             **/
                            try {
                                // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'MapPoint' }})
                                await TableUpdates.upsert({table_name: 'MapPoint', date: Date.now()})
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

            const mapPointsList = await MapPoint.findAndCountAll({
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

            mapPointsList.rows.map(item => {
                let newItem = JSON.parse(JSON.stringify(item))

                const result = readFile(newItem.file_name)
                if (result.hasOwnProperty('status')) {
                    if (result.status === 'ok') {
                        newItem.data = result.data
                    }
                }
                newItem.image = newItem.image_logo


                delete newItem.active
                delete newItem.createdAt
                delete newItem.created_by_user_id
                delete newItem.created_date
                // data
                // description
                delete newItem.file_name
                delete newItem.google_map_url
                delete newItem.image_logo
                // id
                // name
                delete newItem.topics
                delete newItem.updatedAt

                // usersArr.map(currUser => {
                //     if (currUser.id === item.created_by_user_id) {
                //         newItem.created_by_user_name = currUser.name
                //         newRows.push(newItem)
                //     }
                // })

                newRows.push(newItem)
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

    async getAllAdmin(req, res, next) {
        try {
            const {sort_code} = req.query
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
            }

            const mapPointsList = await MapPoint.findAndCountAll({
                    // limit: 10,
                    // attributes: ['tag', tagSearch],
                    order: [sortOrder,
                        // ['name', 'DESC'],
                        // ['name', 'ASC'],
                    ],
                }
            )

            let newRows = []

            const usersArr = await User.findAll()

            mapPointsList.rows.map(item => {
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

    async getByIdAdmin(req, res, next) {
        const {id} = req.params
        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        } else {
            const candidate = await MapPoint.findOne({where: {id}})

            if (candidate) {
                const result = readFile(candidate.file_name)
                if (result.hasOwnProperty('status')) {
                    if (result.status === 'ok') {
                        candidate.data = result.data
                    }
                }
                return res.json({status: 'ok', data: candidate})
            }
        }
        return next(ApiError.internal("Ошибка чтения данных файла"))

    }

    async getById(req, res, next) {
        const {id} = req.params
        try {
            if (!id) {
                return next(ApiError.badRequest("Ошибка параметра"))
            } else {
                const candidate = await MapPoint.findOne({where: {id}})
                if (candidate) {
                    let resultItem = JSON.parse(JSON.stringify(candidate))
                    if (candidate.active) {
                        const result = await readFile(candidate.file_name)
                        if (result.hasOwnProperty('status')) {
                            if (result.status === 'ok') {
                                resultItem.data = result.data
                            }
                        }
                        resultItem.image = resultItem.image_logo


                        delete resultItem.active
                        delete resultItem.createdAt
                        delete resultItem.created_by_user_id
                        delete resultItem.created_date
                        // data
                        // description
                        delete resultItem.file_name
                        delete resultItem.google_map_url
                        delete resultItem.image_logo
                        // id
                        // name
                        delete resultItem.topics
                        delete resultItem.updatedAt

                        return res.json({status: 'ok', data: resultItem})
                    }
                }else {
                    return res.json({status: 'error', message: 'Object not found'})
                }
            }
            return next(ApiError.internal("Ошибка чтения данных файла"))
        }catch (e) {
            return next(ApiError.internal(e.message))
        }
    }

    async getByTour(req, res) {

    }

    async deleteMapPoint(req, res, next) {
        const {id} = req.query
        try {
            if (!id) {
                return next(ApiError.badRequest("Ошибка параметра"))
            } else {
                /**
                 Обновление таблиц
                 **/
                try {
                    await TableUpdates.upsert({table_name: 'MapPoint', date: Date.now()})
                } catch (e) {
                }
                const candidate = await MapPoint.findOne({where: {id}})

                if (candidate) {

                    try {

                        let imgFileName = candidate.file_name.substring(candidate.file_name.lastIndexOf("/") + 1, candidate.file_name.length);
                        if (process.platform === 'win32') {
                            imgFileName = candidate.file_name.substring(candidate.file_name.lastIndexOf("\\") + 1, candidate.file_name.length);
                        }

                        const imgFilePath = path.resolve(__dirname, '..', "static", imgFileName)
                        fs.unlinkSync(imgFilePath)
                    } catch (e) {
                    }

                    const result = removeFile("data/" + candidate.file_name)
                    if (result.hasOwnProperty('status')) {
                        if (result.status === 'ok') {
                            await Files.destroy({where: {table_name: 'MapPoint', file_name: candidate.file_name}})
                            const count = await MapPoint.destroy({where: {id: id}})
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

    async getDataAdmin(req, res, next) {
        const {id} = req.params
        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        } else {
            const candidate = await MapPoint.findOne({where: {id}})

            if (candidate) {
                return res.json(readFile(candidate.file_name))
            }
        }
        return next(ApiError.internal("Ошибка чтения данных файла"))

    }

    async getData(req, res, next) {
        const {id} = req.params
        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        } else {
            const candidate = await MapPoint.findOne({where: {id}})

            if (candidate) {
                return res.json(readFile(candidate.file_name))
            }
        }
        return next(ApiError.internal("Ошибка чтения данных файла"))

    }

}

module.exports = new MapPointController()