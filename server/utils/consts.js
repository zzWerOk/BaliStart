import path from "path";
import fs from "fs";
import {Files} from "../models/models";
import uniqueFilename from "unique-filename";
// const uniqueFilename = require('unique-filename')

// export const createNewFile = (textData, tableName, next) => {
//     return {status: 'ok', message: 'next'}
//     try {
//         let dirName = getDirName(tableName)
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
//
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
//
// const addNewFileNameToTable = (tableName, fileName, next) => {
//     Files.create({table_name: tableName, file_name: fileName}).then(next)
// }
