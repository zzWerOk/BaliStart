const {TableUpdates, ToursType} = require("../models/models");
const ApiError = require("../error/ApiError");

class ToursTypeController {

    async create(req, res, next) {
        try {
            const {type_name, description = ''} = req.body
            if (type_name) {
                const candidate = await ToursType.findOne({where: {type_name}})

                if (!candidate) {
                    await ToursType.create({type_name, description, is_active: true})
                    const newItem = await ToursType.findOne({where: {type_name}})
                    if (newItem) {
                        /**
                         Обновление таблиц
                         **/
                        try {
                            // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'ToursType' }})
                            await TableUpdates.upsert({table_name: 'ToursType', date: Date.now()})
                        } catch (e) {
                        }

                        return res.json({status: 'ok', id: newItem.id})
                    }

                    return next(ApiError.badRequest("Ошибка при создании типа"))
                }
                return next(ApiError.badRequest("Ошибка, тип уже есть"))
            } else {
                return next(ApiError.forbidden("Необходимо указать название типа..."))
            }
        } catch (e) {
            return next(ApiError.forbidden("Ошибка добавления типа"))
        }
    }

    async change(req, res, next) {
        const {id, type_name, description} = req.body
        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        }
        const currItem = await ToursType.findOne({where: {id: id}})

        if (currItem) {

            currItem.type_name = type_name;
            currItem.description = description;

            await currItem.save();
            /**
             Обновление таблиц
             **/
            try {
                // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'ToursType' }})
                await TableUpdates.upsert({table_name: 'ToursType', date: Date.now()})
            } catch (e) {
            }

            return res.json({status: 'ok'})
        }
        return next(ApiError.badRequest("Ошибка установки параметра"))
    }

    async getAll(req, res) {
        const topicsCategoriesList = await ToursType.findAndCountAll({
                // limit: 10,
                order: [
                    ['id', 'DESC'],
                    // ['name', 'ASC'],
                ]
            }
        )
        return res.json(topicsCategoriesList)
    }

    async setActive(req, res, next) {
        const {id, active} = req.body

        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        } else {
            const currItem = await ToursType.findOne({where: {id: id}})
            if (currItem) {
                await ToursType.update(
                    {
                        is_active: active,
                    },
                    {
                        where: {id: currItem.id},
                    }
                );
                /**
                 Обновление таблиц
                 **/
                try {
                    // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'ToursType' }})
                    await TableUpdates.upsert({table_name: 'ToursType', date: Date.now()})
                } catch (e) {
                }

                return res.json({status: 'ok'})
            }
            return next(ApiError.badRequest("Ошибка установки параметра"))
        }
    }

    async getById(req, res, next) {
        const {id} = req.params
        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        } else {
            const currItem = await ToursType.findOne({where: {id: id}})
            return res.json(currItem)
        }

    }

    async deleteTopicCategory(req, res, next) {
        const {id} = req.query
        // const {id} = req.params
        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        } else {
            /**
             Обновление таблиц
             **/
            try {
                // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'ToursType' }})
                await TableUpdates.upsert({table_name: 'ToursType', date: Date.now()})
            } catch (e) {
            }

            const count = await ToursType.destroy({where: {id: id}})
            if(count > 0) {
                // return res.json(`Удалено записей: ${count}`)
                return res.json({status: 'ok'})
            }
            return next(ApiError.internal("Ошибка удаления"))
        }

    }

}

module.exports = new ToursTypeController()