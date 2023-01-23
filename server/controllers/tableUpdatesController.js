const {TableUpdates} = require("../models/models");
const ApiError = require("../error/ApiError");

class TableUpdatesController{

    async set(req, res){
        await TableUpdates.upsert({table_name:req.body.table_name, date:Date.now()})
    }

    async get(req, res, next){
        const {table_name} = req.query
        const candidate = await TableUpdates.findOne({where: {table_name: table_name}})
        if(candidate){
            res.json({date: candidate.date})
            return
        }
        // return next(ApiError.badRequest("Таблицы нет"))
        res.json({date: 0})
    }

}

module.exports = new TableUpdatesController()