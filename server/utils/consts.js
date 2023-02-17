const path = require('path')
const fs = require("fs")
const {Files} = require("../models/models")
const uniqueFilename = require("unique-filename")

removeFile = function (fileName) {

    try {

        if (fileName) {
            // const filePath = path.resolve(__dirname, '..', "data", fileName)
            const filePath = path.resolve(__dirname, '..', fileName)

            fs.unlinkSync(filePath)
        }
        return {status: 'ok'}
    } catch (e) {
        // throw e
    }

}

readFile = function (fileName) {

    try {
        const filePath = path.resolve(__dirname, '..', "data", fileName)
        let data = fs.readFileSync(filePath, 'utf8')
        return {status: 'ok', data}
    } catch (e) {
        return {status: 'error', message: e.message}
    }

}

reWrightFile = async function (textData, tableName, fileName) {
    try {
        let dirName = getDirName(tableName)

        const dirPath = path.resolve(__dirname, '..', "data")
        // fs.mkdir(dirPath, (err) => {
        //     if (err) {
        //         return {err}
        //     }
        // });
        // fs.mkdir(dirPath + "/" + dirName, (err) => {
        //     if (err) {
        //         return {err}
        //     }
        // });

        // fs.mkdir(dirPath + "/" + dirName,  { recursive: true },(err) => {
        //     if (err) {
        //         return {err}
        //     }
        // });

        fs.mkdirSync(dirPath + "/" + dirName,  { recursive: true });

        const filePath = path.resolve(__dirname, '..', "data", fileName)

        await fs.writeFile(filePath, "" + textData, 'utf-8', (err) => {
            return {error: 'error', message: err}
        })

        return {status: 'ok', fileName: fileName}

    } catch (e) {
    }
    return {error: "Ошибка создания файла"}
}

createNewFile = async function (textData, tableName, img) {

    try {
        let dirName = getDirName(tableName)

        const fileName = getFreeFileName(dirName)

        const dirPath = path.resolve(__dirname, '..', "data")
        // // fs.mkdir(dirPath, { recursive: true },(err) => {
        // //     if (err) {
        // //         return {err}
        // //     }
        // // });
        // fs.mkdir(dirPath + "/" + dirName,  { recursive: true },(err) => {
        //     if (err) {
        //         return {err}
        //     }
        // });
        // // fs.mkdirSync(dirPath + "/" + dirName,  { recursive: true });
        // // await fs.promises.mkdir(dirPath + "/" + dirName, { recursive: true })
        //
        // // let fullPath = dirPath + "/" + dirName
        // // fullPath.split('/').reduce(
        // //     (directories, directory) => {
        // //         directories += `${directory}/`;
        // //         if (!fs.existsSync(directories)) {
        // //             fs.mkdirSync(directories);
        // //         }
        // //         return directories;
        // //     },
        // //     '',
        // // );

        fs.mkdirSync(dirPath + "/" + dirName,  { recursive: true });

        const filePath = path.resolve(__dirname, '..', "data", fileName)

        await fs.writeFile(filePath, "" + textData, 'utf-8', (err) => {
            return {error: 'error', message: err}
        })

        let imageMd5 = ''

        if (img) {
            imageMd5 = img.md5 || ''
        }

        await addNewFileNameToTable(tableName, fileName, imageMd5)

        let imgFileName = ''
        if (img) {
            try {
                // imgFileName = fileName.split('\\')[1]
                imgFileName = fileName.substring(fileName.lastIndexOf("/") + 1, fileName.length);
                await img.mv(path.resolve(__dirname, '..', "static", imgFileName)).then()
                return {'status': 'ok', fileName, imgFileName}
            } catch (e) {
                return {status: 'error', message: e.message}
            }
        }

        return {status: 'ok', fileName}

    } catch (e) {
        return {error: e.message}
    }
    // return {error: "Ошибка создания файла"}
}

getDirName = function (tableName) {
// export const getDirName = (tableName) => {
    let dirName

    switch (tableName) {
        case 'Topics':
        case 'Topic':
            dirName = 'topics'
            break
        case 'MapPoint':
            dirName = 'mappoint'
            break
        case 'img':
            dirName = 'static'
            break
        case 'Tours':
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
addNewFileNameToTable = async function (tableName, fileName, next, md5 = '') {
// export const addNewFileNameToTable = (tableName, fileName, next) => {
    Files.create({table_name: tableName, file_name: fileName, md5}).then(next)
}

module.exports = {
    getFreeFileName,
    getDirName,
    readFile,
    removeFile,
    reWrightFile,
    createNewFile,
}

