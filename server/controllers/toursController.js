const {TableUpdates} = require("../models/models");

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

    async getAll(req, res){

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