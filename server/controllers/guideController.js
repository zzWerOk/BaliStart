const {TableUpdates, Guide} = require("../models/models");
const ApiError = require("../error/ApiError");

class GuideController {

    async create(req, res) {
        const {
            user_id,
            avatar_img,
            name,
            about,
            religion,
            experience,
            active_till,
            visible_till,
            phones,
            email,
            is_has_car,
            languages,
            tours_ids,
            is_emergency_help,
            emergency_help_price,
            is_can_discount,
            holidays,
        } = req.body

        try {

            if (user_id !== null) {
                if (user_id !== undefined) {

                    const candidate = await Guide.findOne({where: {user_id}})

                    if(!candidate) {
                        const guide = await Guide.create({
                            user_id,
                            avatar_img,
                            name,
                            about,
                            religion,
                            experience,
                            active_till,
                            visible_till,
                            phones,
                            email,
                            is_has_car,
                            languages,
                            tours_ids,
                            is_emergency_help,
                            emergency_help_price,
                            is_can_discount,
                            holidays,
                        })

                        if(guide) {
                            /**
                             Обновление таблиц
                             **/
                            await TableUpdates.upsert({table_name: 'Guides', date: Date.now()})
                            return res.json({status: 'ok'})
                        }
                    }else{
                        return res.json({status: 'ok', message: 'User already a guide'})
                    }
                }
            }
            return res.json({status: 'error', message: 'No params'})

        } catch (e) {
            return res.json({status: 'error', message: e.message})
        }

    }

    async change(req, res) {
        try {
            /**
             Обновление таблиц
             **/
            await TableUpdates.upsert({table_name: 'Guides', date: Date.now()})
        } catch (e) {
        }

    }

    async getAll(req, res) {

    }

    async getById(req, res, next) {
        // const {id} = req.query
        const {id} = req.params
        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        } else {
            const currGuide = await Guide.findOne({where: {userId: id}})
            return res.json(currGuide)
        }
    }

    async deleteGuide(req, res) {
        try {
            /**
             Обновление таблиц
             **/
            await TableUpdates.upsert({table_name: 'Guides', date: Date.now()})
        } catch (e) {
        }

    }

}

module.exports = new GuideController()