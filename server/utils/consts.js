const path = require('path')
const fs = require("fs")
const {Files} = require("../models/models")
const uniqueFilename = require("unique-filename")
const sharp = require('sharp');

dateToEpoch = function (date) {
    return new Date(date).getTime() / 1000 || 0
}

removeFile = async function (fileName) {
    try {

        return new Promise(function (res) {

            if (fileName) {

                // const filePath = path.resolve(__dirname, '..', fileName)
                const filePath = path.join(__dirname, '..', fileName)

                if (fs.existsSync(filePath)) {
                    fs.promises.unlink(filePath)
                }
                res({status: 'ok'})
            }
        })

    } catch (e) {

    }
    return {status: 'error'}
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

        if (dirName !== 'static') {
            await fs.mkdir(dirPath + "/" + dirName, {recursive: true}, (err) => {
                return {error: 'error', message: err}
            })
        }

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

                if (process.platform === 'win32') {
                    imgFileName = fileName.substring(fileName.lastIndexOf("\\") + 1, fileName.length);
                } else {
                    imgFileName = fileName.substring(fileName.lastIndexOf("/") + 1, fileName.length);
                }

                await img.mv(path.resolve(__dirname, '..', "static", imgFileName + '_orig')).then(() => {

                    try {
                        removeFile('/static/' + imgFileName)
                        removeFile('/static/' + imgFileName + '_s')
                        removeFile('/static/' + imgFileName + '_th')

                        resizeImageWithThumb('static/' + imgFileName)// createNewFile
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
            await removeFile('/static/' + imgFileName)
            await removeFile('/static/' + imgFileName + '_orig')
            await removeFile('/static/' + imgFileName + '_s')
            await removeFile('/static/' + imgFileName + '_th')
        }

        if (filePath && filePath !== '') {
            await removeFile('/data/' + filePath)
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


async function resizeImageWithThumb(filePath) {
    try {
        sharp.cache(false);
        return new Promise(async () => {

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
        })

    } catch (e) {

    }
    return null
}

async function resizeImage(height, filePath_read, filePath_save, onFinishFunc) {
    return new Promise(async () => {

        return await sharp(filePath_read)
            .resize({height: height})
            .toFile(filePath_save, (err) => {
                if (err) {
                    console.log('resize error ', filePath_save)
                    return null
                }

                if (onFinishFunc !== null) {
                    onFinishFunc()
                }
            })
    })
}

async function resizeUserAvatarWithThumb(filePath) {
    sharp.cache(false);

    try {
        return new Promise(async () => {

            return await resizeImage(250, filePath + '_orig', filePath, async () => {
                await resizeImage(150, filePath + '_orig', filePath + '_s', async () => {
                    await resizeImage(70, filePath + '_orig', filePath + '_th', () => {
                        removeFile(filePath + '_orig')
                    })
                })
            })
        })

    } catch (e) {

    }
    return null
}

async function saveUserAvatarWithThumb(img, imgFileName, candidate) {

    if (process.platform === 'win32') {
        imgFileName = candidate.avatar_img.substring(candidate.avatar_img.lastIndexOf("\\") + 1, candidate.avatar_img.length);
    } else {
        imgFileName = candidate.avatar_img.substring(candidate.avatar_img.lastIndexOf("/") + 1, candidate.avatar_img.length);
    }

    await img.mv(path.resolve(__dirname, '..', "static", imgFileName + '_orig')).then(() => {

        removeFile('static/' + imgFileName)
        removeFile('static/' + imgFileName + '_s')
        removeFile('static/' + imgFileName + '_th')

        resizeUserAvatarWithThumb('static/' + imgFileName)
    })

    await sleep(200)


}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
    sleep,
    saveUserAvatarWithThumb,
}

