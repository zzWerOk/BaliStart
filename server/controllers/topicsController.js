const {TableUpdates, Topics, Files, User} = require("../models/models");
const ApiError = require("../error/ApiError");
const fs = require("fs");
const uniqueFilename = require("unique-filename");
const path = require("path");
const {rows} = require("pg/lib/defaults");
const {Op} = require("sequelize");
const {createNewFile} = require("../utils/consts.js");
const {reWrightFile, readFile, removeFile} = require("../utils/consts");


// module.exports.removeFile = function (fileName) {
// // const removeFile = (fileName) => {
//
//     try {
//         const filePath = path.resolve(__dirname, '..', "data", fileName)
//         // let data = fs.readFileSync(filePath, 'utf8')
//
//         fs.unlinkSync(filePath)
//
//         return {status: 'ok'}
//     } catch (e) {
//         throw e
//         // return {status: 'error', message: e.message}
//     }
//
// }
//
// module.exports.readFile = function (fileName) {
// // const readFile = (fileName) => {
//
//     try {
//         const filePath = path.resolve(__dirname, '..', "data", fileName)
//         let data = fs.readFileSync(filePath, 'utf8')
//         return {status: 'ok', data}
//     } catch (e) {
//         return {status: 'error', message: e.message}
//     }
//
// }
//
// module.exports.reWrightFile = function (textData, tableName, fileName, next) {
// // const reWrightFile = (textData, tableName, fileName, next) => {
//     try {
//         let dirName = getDirName(tableName)
//
//         const dirPath = path.resolve(__dirname, '..', "data")
//         fs.mkdir(dirPath, (err) => {
//             if (err) {
//                 return {err}
//             }
//         });
//         fs.mkdir(dirPath + "/" + dirName, (err) => {
//             if (err) {
//                 return {err}
//             }
//         });
//
//         const filePath = path.resolve(__dirname, '..', "data", fileName)
//
//         fs.writeFile(filePath, "" + textData, 'utf-8', (err) => {
//             return {error: 'error', message: err}
//         })
//
//         // addNewFileNameToTable(tableName, fileName, () => {})
//         return {status: 'ok', fileName: fileName}
//
//     } catch (e) {
//         // return {error: e.message}
//     }
//     return {error: "Ошибка создания файла"}
// }
//
// module.exports.createNewFile = function (textData, tableName, img, next) {
// // export const createNewFile = (textData, tableName, img, next) => {
//     try {
//         let dirName = getDirName(tableName)
//
//         const fileName = getFreeFileName(dirName)
//         const dirPath = path.resolve(__dirname, '..', "data")
//         fs.mkdir(dirPath, (err) => {
//             if (err) {
//                 return {err}
//             }
//         });
//         fs.mkdir(dirPath + "/" + dirName, (err) => {
//             if (err) {
//                 return {err}
//             }
//         });
//
//         const filePath = path.resolve(__dirname, '..', "data", fileName)
//
//         fs.writeFile(filePath, "" + textData, 'utf-8', (err) => {
//             return {error: 'error', message: err}
//         })
//
//         addNewFileNameToTable(tableName, fileName)
//
//         let imgFileName = ''
//         if (img) {
//             try {
//                 imgFileName = fileName.split('\\')[1]
//                 img.mv(path.resolve(__dirname, '..', "static", imgFileName)).then(r => {
//                     return {status: 'ok', fileName: fileName, imgFileName: r}
//                 })
//             } catch (e) {
//                 return {status: 'error', message: e.message}
//             }
//         }
//
//         return {status: 'ok', fileName: fileName}
//
//     } catch (e) {
//         // return {error: e.message}
//     }
//     return {error: "Ошибка создания файла"}
// }
//
// module.exports.getDirName = function (tableName) {
// // export const getDirName = (tableName) => {
//     let dirName = 'static'
//
//     switch (tableName) {
//         case 'Topics':
//             dirName = 'topics'
//             break
//         case 'MapPoint':
//             dirName = 'mappoint'
//             break
//         case 'img':
//             dirName = 'static'
//             break
//         case 'Tour':
//             dirName = 'tour'
//             break
//         default:
//             dirName = 'other'
//             break
//     }
//     return dirName
// }
//
// module.exports.getFreeFileName = function (dirName) {
// // export const getFreeFileName = (dirName) => {
//     let fileName = ''
//     let fileCandidate = null
//     while (!fileCandidate) {
//         fileName = uniqueFilename(dirName)
//         fileCandidate = Files.findOne({where: {file_name: fileName}})
//     }
//
//     return fileName
// }
//
// module.exports.addNewFileNameToTable = function (tableName, fileName, next) {
// // export const addNewFileNameToTable = (tableName, fileName, next) => {
//     Files.create({table_name: tableName, file_name: fileName}).then(next)
// }

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
                        if(result.imgFileName){
                            imgFileName = result.imgFileName
                        }

                        // let imgFileName = ''
                        // try {
                        //     if (img) {
                        //         imgFileName = fileName.split('\\')[1]
                        //         await img.mv(path.resolve(__dirname, '..', "static", imgFileName))
                        //     }
                        // } catch (e) {
                        //     return res.json({status: 'error', message: e.message})
                        // }

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
                            // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'User' }})
                            await TableUpdates.upsert({table_name: 'Topics', date: Date.now()})
                        } catch (e) {
                        }

                        try {
                            if (img) {
                                return res.json({status: 'ok', id: newTopic.id, 'image_logo': imgFileName})
                            }
                        } catch (e) {
                        }

                        return res.json({status: 'ok', id: newTopic.id})
                    }else{
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