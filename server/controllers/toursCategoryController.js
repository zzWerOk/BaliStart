const {TableUpdates, ToursCategory} = require("../models/models");
const ApiError = require("../error/ApiError");

class ToursCategoryController {

    async create(req, res, next) {
        try {
            const {category_name, description = ''} = req.body
            if (category_name) {
                const candidate = await ToursCategory.findOne({where: {category_name}})

                if (!candidate) {
                    await ToursCategory.create({category_name, description, is_active: true})
                    const newItem = await ToursCategory.findOne({where: {category_name}})
                    if (newItem) {
                        /**
                         Обновление таблиц
                         **/
                        try {
                            // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'ToursCategory' }})
                            await TableUpdates.upsert({table_name: 'ToursCategory', date: Date.now()})
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
        const {id, category_name, description} = req.body
        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        }
        const currItem = await ToursCategory.findOne({where: {id: id}})

        if (currItem) {

            currItem.category_name = category_name;
            currItem.description = description;

            await currItem.save();
            /**
             Обновление таблиц
             **/
            try {
                // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'ToursCategory' }})
                await TableUpdates.upsert({table_name: 'ToursCategory', date: Date.now()})
            } catch (e) {
            }

            return res.json({status: 'ok'})
        }
        return next(ApiError.badRequest("Ошибка установки параметра"))
    }

    async getAll(req, res) {
        const topicsCategoriesList = await ToursCategory.findAndCountAll({
                is_active: true,
                order: [
                    ['id', 'DESC'],
                ]
            }
        )

        let newRows = []
        topicsCategoriesList.rows.map(item => {
            let newItem = JSON.parse(JSON.stringify(item))

            newItem.name = newItem.category_name

            delete newItem.is_active
            delete newItem.createdAt
            delete newItem.updatedAt
            delete newItem.category_name

            newRows.push(newItem)
        })
        return res.json({
            count: newRows.length,
            'rows': newRows
        })
        // return res.json(topicsCategoriesList)
    }

    async getAllAdmin(req, res) {
        const topicsCategoriesList = await ToursCategory.findAndCountAll({
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
            const currItem = await ToursCategory.findOne({where: {id: id}})
            if (currItem) {
                await ToursCategory.update(
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
                    // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'ToursCategory' }})
                    await TableUpdates.upsert({table_name: 'ToursCategory', date: Date.now()})
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
            const currItem = await ToursCategory.findOne({where: {id: id}})
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
                // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'ToursCategory' }})
                await TableUpdates.upsert({table_name: 'ToursCategory', date: Date.now()})
            } catch (e) {
            }

            const count = await ToursCategory.destroy({where: {id: id}})
            if (count > 0) {
                // return res.json(`Удалено записей: ${count}`)
                return res.json({status: 'ok'})
            }
            return next(ApiError.internal("Ошибка удаления"))
        }

    }

}

module.exports = new ToursCategoryController()