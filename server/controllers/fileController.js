// import urid from 'urid'
const ApiError = require("../error/ApiError")
const path = require('path')
// const urid = require('urid')
const urid = 'urid'
const fs = require('fs')
const {Files} = require('../models/models')
const uniqueFilename = require('unique-filename')

// const getDirName = (tableName) => {
//     let dirName = 'static'
//
//     switch (tableName) {
//         case 'Topic':
//             dirName = 'topics'
//             break
//         case 'MapPoint':
//             dirName = 'mappoint'
//             break
//         case 'img':
//             dirName = 'static'
//             break
//         case 'Tour':
//             dirName = 'tour'
//             break
//         default:
//             dirName = 'other'
//             break
//     }
//     return dirName
// }

// const getFreeFileName = () => {
//     let fileName = ''
//     let fileCandidate = null
//     while (!fileCandidate) {
//         // fileName = urid('ALPHANUM')
//         fileName = uniqueFilename()
//         fileCandidate = Files.findOne({where: {file_name: fileName}})
//     }
//
//     return fileName
// }

// const addNewFileNameToTable = (tableName, fileName, next) => {
//     Files.create({table_name: tableName, file_name: fileName}).then(next)
// }

class FileController {

    // createNewFile = (textData, tableName, next) => {
    //     return {status: 'ok', message: 'next'}
    //     try {
    //         let dirName = getDirName(tableName)
    //
    //
    //         const fileName = getFreeFileName()
    //         const filePath = path.resolve(__dirname, '..', dirName, fileName)
    //
    //         fs.writeFile(filePath, textData, 'utf-8', (err) => {
    //             Files.create({table_name: tableName, file_name: fileName}).then()
    //
    //             addNewFileNameToTable(tableName, fileName, () => {
    //                 return {status: 'ok', fileName: fileName}
    //             })
    //         })
    //
    //         // fs.writeFile(filePath, '', function (err) {
    //         //     if (err) return {error: "Ошибка создания файла"}
    //         //
    //         //     Files.create({table_name: tableName, file_name: fileName}).then()
    //         //
    //         //     addNewFileNameToTable(tableName, fileName, () => {
    //         //         return {status: 'ok', fileName: fileName}
    //         //     })
    //         // });
    //
    //     } catch (e) {
    //     }
    //     return {error: "Ошибка создания файла"}
    // }
    //
    // // async uploadFile(req, res, next) {
    // //     try {
    // //
    // //         const {img} = req.files
    // //         const fileName = getFreeFileName()
    // //
    // //         img.mv(path.resolve(__dirname, '..', 'static', fileName))
    // //
    // //
    // //         // await Files.create({table_name: 'img', file_name: fileName})
    // //         addNewFileNameToTable('img', fileName, () => {
    // //             return {status: "ok", message: fileName}
    // //         })
    // //
    // //
    // //     } catch (e) {
    // //         return next(ApiError.internal("Ошибка загрузки файла"))
    // //     }
    // // }

}

module.exports = new FileController()