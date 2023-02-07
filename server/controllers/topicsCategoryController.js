const {TopicsCategory, TableUpdates} = require("../models/models");
const ApiError = require("../error/ApiError");

class TopicsCategoryController {

    async create(req, res, next) {
        try {
            const {category_name, description = ''} = req.body
            if (category_name) {
                const candidate = await TopicsCategory.findOne({where: {category_name}})

                if (!candidate) {
                    await TopicsCategory.create({category_name, description, is_active: true})
                    const newItem = await TopicsCategory.findOne({where: {category_name}})
                    if (newItem) {
                        /**
                         Обновление таблиц
                         **/
                        try {
                            // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'TopicsCategory' }})
                            await TableUpdates.upsert({table_name: 'TopicsCategory', date: Date.now()})
                        } catch (e) {
                        }

                        return res.json({status: 'ok', id: newItem.id})
                    }

                    return next(ApiError.badRequest("Ошибка при создании категории"))
                }
                return next(ApiError.badRequest("Ошибка, категория уже есть"))
            } else {
                return next(ApiError.forbidden("Необходимо указать название категории..."))
            }
        } catch (e) {
            return next(ApiError.forbidden("Ошибка добавления категории"))
        }
    }

    async change(req, res, next) {
        const {id, category_name, is_for_tour=false, description} = req.body
        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        }
        const currItem = await TopicsCategory.findOne({where: {id: id}})

        if (currItem) {

            currItem.category_name = category_name;
            currItem.description = description;
            currItem.is_for_tour = is_for_tour;

            await currItem.save();
            /**
             Обновление таблиц
             **/
            try {
                // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'TopicsCategory' }})
                await TableUpdates.upsert({table_name: 'TopicsCategory', date: Date.now()})
            } catch (e) {
            }

            return res.json({status: 'ok'})
        }
        return next(ApiError.badRequest("Ошибка установки параметра"))
    }

    async getAll(req, res) {
        const {sort} = req.query

        const sortTag = sort || 'DESC'

        const topicsCategoriesList = await TopicsCategory.findAndCountAll({
                // limit: 10,
                order: [
                    ['id', sortTag],
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
            const currItem = await TopicsCategory.findOne({where: {id: id}})
            if (currItem) {
                await TopicsCategory.update(
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
                    // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'TopicsCategory' }})
                    await TableUpdates.upsert({table_name: 'TopicsCategory', date: Date.now()})
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
            const currItem = await TopicsCategory.findOne({where: {id: id}})
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
                // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'TopicsCategory' }})
                await TableUpdates.upsert({table_name: 'TopicsCategory', date: Date.now()})
            } catch (e) {
            }

            const count = await TopicsCategory.destroy({where: {id: id}})
            if(count > 0) {
                // return res.json(`Удалено записей: ${count}`)
                return res.json({status: 'ok'})
            }
            return next(ApiError.internal("Ошибка удаления"))
        }

    }

}

module.exports = new TopicsCategoryController()