const path = require('path')
const fs = require("fs")
const {Files} = require("../models/models")
const uniqueFilename = require("unique-filename")

// require {path} = "path";
// import fs from "fs";
// import {Files} from "../models/models";
// import uniqueFilename from "unique-filename";

module.exports.removeFile = function (fileName) {
// const removeFile = (fileName) => {

    try {
        const filePath = path.resolve(__dirname, '..', "data", fileName)

        fs.unlinkSync(filePath)

        return {status: 'ok'}
    } catch (e) {
        throw e
    }

}

module.exports.readFile = function (fileName) {
// const readFile = (fileName) => {

    try {
        const filePath = path.resolve(__dirname, '..', "data", fileName)
        let data = fs.readFileSync(filePath, 'utf8')
        return {status: 'ok', data}
    } catch (e) {
        return {status: 'error', message: e.message}
    }

}

module.exports.reWrightFile = function (textData, tableName, fileName, next) {
// const reWrightFile = (textData, tableName, fileName, next) => {
    try {
        let dirName = getDirName(tableName)

        const dirPath = path.resolve(__dirname, '..', "data")
        fs.mkdir(dirPath, (err) => {
            if (err) {
                return {err}
            }
        });
        fs.mkdir(dirPath + "/" + dirName, (err) => {
            if (err) {
                return {err}
            }
        });

        const filePath = path.resolve(__dirname, '..', "data", fileName)

        fs.writeFile(filePath, "" + textData, 'utf-8', (err) => {
            return {error: 'error', message: err}
        })

        return {status: 'ok', fileName: fileName}

    } catch (e) {
    }
    return {error: "Ошибка создания файла"}
}

module.exports.createNewFile = function (textData, tableName, img, next) {
// export const createNewFile = (textData, tableName, img, next) => {
    try {
        let dirName = getDirName(tableName)

        const fileName = getFreeFileName(dirName)
        const dirPath = path.resolve(__dirname, '..', "data")
        fs.mkdir(dirPath, (err) => {
            if (err) {
                return {err}
            }
        });
        fs.mkdir(dirPath + "/" + dirName, (err) => {
            if (err) {
                return {err}
            }
        });

        const filePath = path.resolve(__dirname, '..', "data", fileName)

        fs.writeFile(filePath, "" + textData, 'utf-8', (err) => {
            return {error: 'error', message: err}
        })

        addNewFileNameToTable(tableName, fileName)

        let imgFileName = ''
        if (img) {
            try {
                imgFileName = fileName.split('\\')[1]
                img.mv(path.resolve(__dirname, '..', "static", imgFileName)).then(r => {
                })
                return {'status': 'ok', fileName, imgFileName}
            } catch (e) {
                return {status: 'error', message: e.message}
            }
        }

        return {status: 'ok', fileName}

    } catch (e) {
        // return {error: e.message}
    }
    return {error: "Ошибка создания файла"}
}

getDirName = function (tableName) {
// export const getDirName = (tableName) => {
    let dirName = 'static'

    switch (tableName) {
        case 'Topics':
            dirName = 'topics'
            break
        case 'MapPoint':
            dirName = 'mappoint'
            break
        case 'img':
            dirName = 'static'
            break
        case 'Tour':
            dirName = 'tour'
            break
        default:
            dirName = 'other'
            break
    }
    return dirName
}

getFreeFileName = function (dirName) {
// export const getFreeFileName = (dirName) => {
    let fileName = ''
    let fileCandidate = null
    while (!fileCandidate) {
        fileName = uniqueFilename(dirName)
        fileCandidate = Files.findOne({where: {file_name: fileName}})
    }

    return fileName
}

addNewFileNameToTable = function (tableName, fileName, next) {
// export const addNewFileNameToTable = (tableName, fileName, next) => {
    Files.create({table_name: tableName, file_name: fileName}).then(next)
}
