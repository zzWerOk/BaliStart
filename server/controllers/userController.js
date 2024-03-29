const {User, Guide, TableUpdates, Agent} = require('../models/models')
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {createNewFile, readFile, saveUserAvatarWithThumb} = require("../utils/consts");
// const path = require("path");
// const fs = require("fs");

const generateJWT = (id, email, isAdmin, isGuide, isAgent) => {
    return jwt.sign(
        {id, email, isAdmin, isGuide, isAgent},
        process.env.SECRET_KEY,
        {expiresIn: '128h'}
    )


}

class UserController {

    async registration(req, res, next) {
        try {
            const {name, email, password} = req.body
            if (name && email && password) {
                const candidate = await User.findOne({where: {email}})

                if (!candidate) {
                    const hashPassword = await bcrypt.hash(password, 5)
                    const user = await User.create({name: name, email: email, password: hashPassword})

                    const token = generateJWT(user.id, email, user.is_admin, false, false)

                    /**
                     Обновление таблиц
                     **/
                    try {
                        // await TableUpdates.update({date: Date.now()}, {where: { table_name: 'User' }})
                        await TableUpdates.upsert({table_name: 'User', date: Date.now()})
                    } catch (e) {
                    }

                    return res.json(token)
                }
                return next(ApiError.badRequest("Ошибка регистрации, уже есть"))
            } else {
                return next(ApiError.forbidden("Необходимо указать все данные пользователя..."))
            }
        } catch (e) {
            return next(ApiError.forbidden("Ошибка добавления пользователя"))
        }
    }

    async setRole(req, res) {
        try {
            const {id, role} = req.body

            if (id && role) {
                const candidate = await User.findOne({where: {id}})

                if (!candidate) {
                    return res.json({error: "Пользователь не найден"})
                    // return next(ApiError.badRequest("Пользователь не найден"))
                }

                switch (role) {
                    case 'Admin':
                        await User.update({
                                is_admin: true,
                                is_guide: false,
                            }, {
                                where: {id: candidate.id},
                            }
                        );
                        break
                    case 'Guide':
                        await User.update({
                                is_admin: false,
                                is_guide: true,
                            }, {
                                where: {id: candidate.id},
                            }
                        );
                        break
                    default:
                        await User.update({
                                is_admin: false,
                                is_guide: false,
                            }, {
                                where: {id: candidate.id},
                            }
                        );
                        break
                }

                /**
                 Обновление таблиц
                 **/
                try {
                    await TableUpdates.upsert({table_name: 'User', date: Date.now()})
                } catch (e) {
                }

                return res.json({status: 'ok'})
            } else {
                return res.json({error: "Необходимо указать все данные пользователя..."})
                // return next(ApiError.forbidden("Необходимо указать все данные пользователя..."))
            }
        } catch (e) {

        }
        return res.json({status: "error"})

    }

    async changeAdmin(req, res) {
        try {
            const {
                id,
                name,
                email,
                is_active,
                is_admin,
                is_guide,
                is_agent,
            } = req.body

            if (email) {
                const candidate = await User.findOne({where: {id}})
                if (candidate) {

                    if (email !== candidate.email) {
                        const userNewEmail = await User.findOne({where: {email}})
                        if (userNewEmail) {
                            return res.json({status: 'error', message: "Cannot change email"})
                        }
                    }

                    let img
                    if (req.files) {
                        img = req.files.img
                    }

                    let imgFileName = candidate.avatar_img

                    const userImageFile = readFile(candidate.avatar_img)
                    if (!userImageFile || candidate.avatar_img === '' || candidate.avatar_img === 'null' || candidate.avatar_img === null) {

                        const result = await createNewFile('', 'img', img)

                        if (result.hasOwnProperty('status')) {
                            if (result.status === 'ok') {
                                if (result.imgFileName) {
                                    imgFileName = result.imgFileName
                                }
                            }
                        }

                    } else {

                        if (img) {

                            await saveUserAvatarWithThumb(img, imgFileName, candidate)

                            // if (process.platform === 'win32') {
                            //     imgFileName = candidate.avatar_img.substring(candidate.avatar_img.lastIndexOf("\\") + 1, candidate.avatar_img.length);
                            // } else {
                            //     imgFileName = candidate.avatar_img.substring(candidate.avatar_img.lastIndexOf("/") + 1, candidate.avatar_img.length);
                            // }
                            //
                            // await img.mv(path.resolve(__dirname, '..', "static", imgFileName + '_orig')).then(() => {
                            //
                            //     removeFile('static/' + imgFileName)
                            //     removeFile('static/' + imgFileName + '_s')
                            //     removeFile('static/' + imgFileName + '_th')
                            //
                            //     resizeUserAvatarWithThumb('static/' + imgFileName)
                            // })
                            //
                            // await sleep(200)

                        }

                    }

                    await User.update(
                        {
                            name,
                            email,
                            avatar_img: imgFileName,
                            is_active,
                            is_admin,
                            is_guide,
                            is_agent,
                        },
                        {
                            where: {id: candidate.id},
                        }
                    );
                    const selectedByUser = req.user

                    const updatedUser = await User.findOne({
                        attributes: {exclude: ['password']},
                        where: {id: candidate.id}
                    })

                    const userDataJson = JSON.parse(JSON.stringify(updatedUser))
                    if ((candidate.id + '') === (selectedByUser.id + '')) {
                        userDataJson.editable = true
                    }

                    return res.json({status: 'ok', data: userDataJson})

                } else {
                    return res.json({status: 'error', message: "No user found"})
                }
            }

            return res.json({status: 'error', message: "Необходимо указать все данные пользователя..."})
        } catch (e) {
            return res.json({status: 'error', message: e.message})
        }
    }

    async login(req, res) {
        try {
            const {email, password} = req.body

            if (email && password) {
                const candidate = await User.findOne({
                    where: {
                        email,
                        is_active: true
                    }
                })

                if (!candidate) {
                    return res.json({error: "Пользователь не найден"})
                    // return next(ApiError.badRequest("Пользователь не найден"))
                }

                const comparePasswords = await bcrypt.compareSync(password, candidate.password)

                if (!comparePasswords) {
                    return res.json({error: "Указан не верный пароль"})
                    // return next(ApiError.badRequest("Указан не верный пароль"))
                }

                // const isGuide = await Guide.findOne({where: {userId: candidate.id}})
                // const token = generateJWT(candidate.id, email, candidate.is_admin, !!isGuide)

                const token = generateJWT(candidate.id, email, candidate.is_admin, candidate.is_guide, candidate.is_agent)

                await User.update(
                    {
                        date_last_login: Date.now(),
                    },
                    {
                        where: {id: candidate.id},
                    }
                );
                /**
                 Обновление таблиц
                 **/
                try {
                    await TableUpdates.upsert({table_name: 'User', date: Date.now()})
                } catch (e) {
                }

                return res.json(token)
            } else {
                return res.json({error: "Необходимо указать все данные пользователя..."})
                // return next(ApiError.forbidden("Необходимо указать все данные пользователя..."))
            }
        } catch (e) {

        }
        return res.json({status: "error"})
    }

    async getMyName(req, res) {
        try {
            const currUser = req.user

            if (currUser) {
                const candidate = await User.findOne({
                    where: {
                        email: currUser.email,
                        is_active: true
                    }
                })

                if (candidate) {
                    return res.json({status: "ok", data: {name: candidate.name, avatar_img: candidate.avatar_img}})
                } else {
                    return res.json({status: "error", message: 'No user found'})
                }
            }
        } catch (e) {
            return res.json({status: "error", message: e.message})
        }
        return res.json({status: "error"})
    }

    async auth(req, res, next) {
        try {
            const candidate = await User.findOne({
                where: {
                    email: req.user.email,
                    is_active: true
                }
            })
            if (!candidate) {
                return next(ApiError.badRequest("Пользователь не найден"))
            }
            // const isGuide = await Guide.findOne({where: {userId: req.user.id}})
            // const token = generateJWT(candidate.id, candidate.email, candidate.is_admin, !!isGuide)
            const token = generateJWT(candidate.id, candidate.email, candidate.is_admin, candidate.is_guide, candidate.is_agent)

            await User.update({date_last_login: Date.now(),}, {where: {id: candidate.id},});
            /**
             Обновление таблиц
             **/
            try {
                await TableUpdates.upsert({table_name: 'User', date: Date.now()})
            } catch (e) {
            }

            return res.json(token)
        } catch (e) {

        }
        return res.json({status: "error"})

        // return res.json(generateJWT(req.user.id, req.user.email, req.user.is_admin, !!isGuide))
    }


    async setActive(req, res, next) {
        try {
            const {id, active} = req.body

            if (!id) {
                return next(ApiError.badRequest("Ошибка параметра"))
            } else {
                const currUser = await User.findOne({where: {id: id}})
                if (currUser) {
                    await User.update(
                        {
                            is_active: active,
                        },
                        {
                            where: {id: currUser.id},
                        }
                    );
                    /**
                     Обновление таблиц
                     **/
                    try {
                        await TableUpdates.upsert({table_name: 'User', date: Date.now()})
                    } catch (e) {
                    }

                    return res.json({status: 'ok'})
                    // return res.json("status: 'ok'")
                }
                return next(ApiError.badRequest("Ошибка установки параметра"))
            }
        } catch (e) {

        }
        return res.json({status: "error"})
    }

    async isActive(req, res, next) {
        try {
            const {id} = req.params
            if (!id) {
                return next(ApiError.badRequest("Ошибка параметра"))
            } else {
                const currUser = await User.findOne({where: {id: id}})
                return res.json(currUser.is_active)
            }
        } catch (e) {

        }
        return res.json({status: "error"})
    }

    async getById(req, res, next) {
        // const {id} = req.query
        try {
            const {id} = req.params
            const selectedByUser = req.user
            if (!id) {
                return next(ApiError.badRequest("Ошибка параметра"))
            } else {
                const currUser = await User.findOne({
                    attributes: {exclude: ['password']},
                    where: {id: id}
                })

                const userDataJson = JSON.parse(JSON.stringify(currUser))
                if ((userDataJson.id + '') === (selectedByUser.id + '')) {
                    userDataJson.editable = true
                }


                return res.json({status: 'ok', data: userDataJson})
            }
        } catch (e) {
            return res.json({status: 'error', message: e.message})
        }
    }

    async getAll(req, res) {
        try {
            const usersList = await User.findAndCountAll({
                    attributes: {exclude: ['password']},
                    // limit: 10,
                    order: [
                        ['id', 'ASC'],
                        // ['name', 'DESC'],
                    ]
                }
            )
            return res.json(usersList)
        } catch (e) {

        }
        return res.json({status: "error"})
    }

    async getAllGuides(req, res) {
        try {
            const usersList = await User.findAndCountAll({
                attributes: {exclude: ['password']},
                where: {is_guide: true},
                order: [
                    ['id', 'ASC'],
                    // ['name', 'DESC'],
                ]
                // limit: 10,
            })

            const guidesArr = []
            for (let i = 0; i < usersList.count; i++) {
                let currUser = JSON.parse(JSON.stringify(usersList.rows[i]))
                const currGuide = await Guide.findOne({where: {user_id: currUser.id}})
                if (currGuide) {
                    currUser.avatar_img = currGuide.avatar_img

                }
                guidesArr.push(currUser)
            }

            // return res.json(usersList)
            return res.json({count: usersList.count, rows: guidesArr})
        } catch (e) {

        }
        return res.json({status: "error"})
    }

    async getAllAgents(req, res) {
        try {
            const usersList = await User.findAndCountAll({
                attributes: {exclude: ['password']},
                where: {is_agent: true},
                order: [
                    ['id', 'ASC'],
                    // ['name', 'DESC'],
                ]
                // limit: 10,
            })

            const agentsArr = []
            for (let i = 0; i < usersList.count; i++) {
                let currUser = JSON.parse(JSON.stringify(usersList.rows[i]))
                const currAgent = await Agent.findOne({where: {user_id: currUser.id}})
                if (currAgent) {
                    currUser.avatar_img = currAgent.avatar_img

                }
                agentsArr.push(currUser)
            }

            // return res.json(usersList)
            return res.json({count: usersList.count, rows: agentsArr})
        } catch (e) {

        }
        return res.json({status: "error"})

    }

    async deleteUser(req, res, next) {
        try {
            const {id} = req.query
            if (!id) {
                return next(ApiError.badRequest("Ошибка параметра"))
            } else {
                /**
                 Обновление таблиц
                 **/
                try {
                    await TableUpdates.upsert({table_name: 'User', date: Date.now()})
                } catch (e) {
                }

                const count = await User.destroy({where: {id: id}})
                return res.json(`Удалено записей: ${count}`)
            }
        } catch (e) {

        }
        return res.json({status: "error"})

    }

}

module.exports = new UserController()