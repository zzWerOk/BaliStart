const {TableUpdates, Topics, User, Tours} = require("../models/models");
const {Op} = require("sequelize");
const ApiError = require("../error/ApiError");

class ToursController{

    async create(req, res){
        /**
         Обновление таблиц
         **/
        try{
            // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'Topics' }})
            await TableUpdates.upsert({table_name:'Tours', date:Date.now()})
        }catch (e){}

    }

    async change(req, res){
        /**
         Обновление таблиц
         **/
        try{
            // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'Topics' }})
            await TableUpdates.upsert({table_name:'Tours', date:Date.now()})
        }catch (e){}

    }

    async getAll(req, res, next){
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

            const topicsCategoriesList = await Tours.findAndCountAll({
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

    async getById(req, res){

    }

    async getByMapPoint(req, res){

    }

    async deleteTour(req, res){
        /**
         Обновление таблиц
         **/
        try{
            // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'Topics' }})
            await TableUpdates.upsert({table_name:'Tours', date:Date.now()})
        }catch (e){}

    }

}

module.exports = new ToursController()