const {TableUpdates} = require("../models/models");

class MapPointController{

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

    async getById(req, res){

    }

    async getByTour(req, res){

    }

    async deleteMapPoint(req, res){
        /**
         Обновление таблиц
         **/
        try{
            // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'MapPoint' }})
            await TableUpdates.upsert({table_name:'MapPoint', date:Date.now()})
        }catch (e){}

    }

}

module.exports = new MapPointController()