const path = require('path')
const fs = require("fs")
const {Files} = require("../models/models")
const uniqueFilename = require("unique-filename")
const sharp = require('sharp');

dateToEpoch = function (date) {
    return new Date(date).getTime() / 1000 || 0
}

removeFile = function (fileName) {

    try {

        if (fileName) {
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

readFileImage = function (fileName) {

    try {
        const filePath = path.resolve(__dirname, '..', "static", fileName)
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

        fs.mkdirSync(dirPath + "/" + dirName, {recursive: true});

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
    let imgFileName = ''
    let filePath = ''
    try {
        let dirName = getDirName(tableName)

        const fileName = getFreeFileName(dirName)

        const dirPath = path.resolve(__dirname, '..', "data")

        fs.mkdirSync(dirPath + "/" + dirName, {recursive: true});

        filePath = path.resolve(__dirname, '..', "data", fileName)

        if (tableName !== 'img') {
            await fs.writeFile(filePath, "" + textData, 'utf-8', (err) => {
                return {error: 'error', message: err}
            })
        }

        let imageMd5 = ''

        if (img) {
            imageMd5 = img.md5 || ''
        }

        await addNewFileNameToTable(tableName, fileName, imageMd5)

        if (img) {
            try {
                imgFileName = fileName.substring(fileName.lastIndexOf("/") + 1, fileName.length);
                await img.mv(path.resolve(__dirname, '..', "static", imgFileName + '_orig')).then(() => {

                    try {
                        removeFile('/static/' + imgFileName)
                        removeFile('/static/' + imgFileName + '_s')
                        removeFile('/static/' + imgFileName + '_th')

                        resizeImageWithThumb('static/' + imgFileName)
                    } catch (e) {
                        console.log('e', e.message)
                    }

                })
                return {'status': 'ok', fileName, imgFileName}
            } catch (e) {
                return {status: 'error', message: e.message}
            }
        }

        return {status: 'ok', fileName}

    } catch (e) {

        if (imgFileName && imgFileName !== '') {
            removeFile('/static/' + imgFileName)
            removeFile('/static/' + imgFileName + '_orig')
            removeFile('/static/' + imgFileName + '_s')
            removeFile('/static/' + imgFileName + '_th')
        }

        if (filePath && filePath !== '') {
            removeFile('/data/' + filePath)
        }

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


function resizeImageWithThumb(filePath) {
    try {

        return resizeImage(500, filePath + '_orig', filePath, () => {
                resizeImage(250, filePath + '_orig', filePath + '_s', () => {
                        resizeImage(100, filePath + '_orig', filePath + '_th', () => {
                                removeFile(filePath + '_orig')
                            }
                        )
                    }
                )
            }
        )

        // let isOk = sharp(filePath + '_orig')
        //     .resize({height: 500})
        //     .toFile(filePath, (err) => {
        //         if (err) throw err;
        //         // console.log(info);
        //
        //         isOk = sharp(filePath + '_orig')
        //             .resize({height: 250})
        //             .toFile(filePath + '_s', (err) => {
        //                 if (err) throw err;
        //                 // console.log(info);
        //
        //                 isOk = sharp(filePath + '_orig')
        //                     .resize({height: 100})
        //                     .toFile(filePath + '_th', (err) => {
        //                         if (err) throw err;
        //
        //                         removeFile(filePath + '_orig')
        //
        //                     });
        //             });
        //     });
        //
        // return isOk
    } catch (e) {

    }
    return null
}

function resizeImage(height, filePath_read, filePath_save, onFinishFunc) {
    return sharp(filePath_read)
        .resize({height: height})
        .toFile(filePath_save, (err) => {
            if (err) return null

            onFinishFunc()

        });
}

function resizeUserAvatarWithThumb(filePath) {
    try {

        return resizeImage(250, filePath + '_orig', filePath, () => {
                resizeImage(150, filePath + '_orig', filePath + '_s', () => {
                        resizeImage(70, filePath + '_orig', filePath + '_th', () => {
                                removeFile(filePath + '_orig')
                            }
                        )
                    }
                )
            }
        )

        // let isOk = sharp(filePath + '_orig')
        //     .resize({height: 500})
        //     .toFile(filePath, (err) => {
        //         if (err) throw err;
        //         // console.log(info);
        //
        //         isOk = sharp(filePath + '_orig')
        //             .resize({height: 250})
        //             .toFile(filePath + '_s', (err) => {
        //                 if (err) throw err;
        //                 // console.log(info);
        //
        //                 isOk = sharp(filePath + '_orig')
        //                     .resize({height: 100})
        //                     .toFile(filePath + '_th', (err) => {
        //                         if (err) throw err;
        //
        //                         removeFile(filePath + '_orig')
        //
        //                     });
        //             });
        //     });
        //
        // return isOk
    } catch (e) {

    }
    return null
}

module.exports = {
    getFreeFileName,
    getDirName,
    readFile,
    removeFile,
    reWrightFile,
    createNewFile,
    dateToEpoch,
    resizeImageWithThumb,
    resizeUserAvatarWithThumb,
}

