const {TableUpdates, User, Guide} = require("../models/models");
const ApiError = require("../error/ApiError");

class GuideController{

    async create(req, res){
        /**
         Обновление таблиц
         **/
        try{
            // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'MapPoint' }})
            await TableUpdates.upsert({table_name:'MapPoint', date:Date.now()})
        }catch (e){}

    }

    async change(req, res){
        /**
         Обновление таблиц
         **/
        try{
            // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'MapPoint' }})
            await TableUpdates.upsert({table_name:'MapPoint', date:Date.now()})
        }catch (e){}

    }

    async getAll(req, res){

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
    async deleteGuide(req, res){
        /**
         Обновление таблиц
         **/
        try{
            // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'MapPoint' }})
            await TableUpdates.upsert({table_name:'MapPoint', date:Date.now()})
        }catch (e){}

    }

}

module.exports = new GuideController()