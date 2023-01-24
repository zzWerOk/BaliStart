const {TableUpdates, MapPoint} = require("../models/models");
const ApiError = require("../error/ApiError");
const {createNewFile} = require("../utils/consts");

class MapPointController {

    async create(req, res, next) {
        try {
            const {
                name,
                description = '',
                topics = '',
                image_logo = '',
                google_map_url = '',
                created_by_user_id = '',
                data_text = '',
            } = req.body

            const created_date = Date.now()

            let img
            if (req.files) {
                img = req.files.img
            }

            if(name) {

                const result = createNewFile(data_text, 'MapPoints', img)

                if (result.hasOwnProperty('status')) {
                    if (result.status === 'ok') {
                        const fileName = result.fileName
                        let imgFileName = ''
                        if(result.imgFileName){
                            imgFileName = result.imgFileName
                        }

                        // try {
                        //     if (img) {
                        //         imgFileName = fileName.split('\\')[1]
                        //         await img.mv(path.resolve(__dirname, '..', "static", imgFileName))
                        //     }
                        // } catch (e) {
                        //     return res.json({status: 'error', message: e.message})
                        // }

                        const newMapPoint = await MapPoint.create({
                            name: name,
                            description: description,
                            topics: topics,
                            image_logo: imgFileName,
                            google_map_url: google_map_url,
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
                    }else{
                        return res.json({status: 'error', message: result.message})
                    }

                }
                return res.json({status: 'error', message: 'Create file error'})

            }
        }catch (e) {
            return next(ApiError.forbidden("Ошибка добавления точки интереса"))
        }
    }

    async change(req, res) {
        /**
         Обновление таблиц
         **/
        try {
            // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'MapPoint' }})
            await TableUpdates.upsert({table_name: 'MapPoint', date: Date.now()})
        } catch (e) {
        }

    }

    async getAll(req, res) {

    }

    async getById(req, res) {

    }

    async getByTour(req, res) {

    }

    async deleteMapPoint(req, res) {
        /**
         Обновление таблиц
         **/
        try {
            // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'MapPoint' }})
            await TableUpdates.upsert({table_name: 'MapPoint', date: Date.now()})
        } catch (e) {
        }

    }

}

module.exports = new MapPointController()