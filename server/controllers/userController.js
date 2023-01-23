const {User, Guide, TableUpdates} = require('../models/models')
const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJWT = (id, email, isAdmin, isGuide) => {
    return jwt.sign(
        {id, email, isAdmin, isGuide},
        process.env.SECRET_KEY,
        {expiresIn: '48h'}
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

                    const token = generateJWT(user.id, email, user.is_admin, false)

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

    async setRole(req, res, next) {
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
    }

    async login(req, res, next) {
        const {email, password} = req.body

        if (email && password) {
            const candidate = await User.findOne({where: {email}})

            if (!candidate) {
                return res.json({error: "Пользователь не найден"})
                // return next(ApiError.badRequest("Пользователь не найден"))
            }

            const comparePasswords = await bcrypt.compareSync(password, candidate.password)

            if (!comparePasswords) {
                return res.json({error: "Указан не верный пароль"})
                // return next(ApiError.badRequest("Указан не верный пароль"))
            }

            const isGuide = await Guide.findOne({where: {userId: candidate.id}})

            const token = generateJWT(candidate.id, email, candidate.is_admin, !!isGuide)

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
    }

    async auth(req, res, next) {
        const candidate = await User.findOne({where: {email: req.user.email}})
        if (!candidate) {
            return next(ApiError.badRequest("Пользователь не найден"))
        }
        const isGuide = await Guide.findOne({where: {userId: req.user.id}})
        // const token = generateJWT(req.user.id, req.user.email, req.user.is_admin, !!isGuide)
        const token = generateJWT(candidate.id, candidate.email, candidate.is_admin, !!isGuide)

        await User.update({date_last_login: Date.now(),}, {where: {id: candidate.id},});
        /**
         Обновление таблиц
         **/
        try {
            await TableUpdates.upsert({table_name: 'User', date: Date.now()})
        } catch (e) {
        }

        return res.json(token)

        // return res.json(generateJWT(req.user.id, req.user.email, req.user.is_admin, !!isGuide))
    }


    async setActive(req, res, next) {
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
    }

    async isActive(req, res, next) {
        const {id} = req.params
        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        } else {
            const currUser = await User.findOne({where: {id: id}})
            return res.json(currUser.is_active)
        }
    }

    async getById(req, res, next) {
        // const {id} = req.query
        const {id} = req.params
        if (!id) {
            return next(ApiError.badRequest("Ошибка параметра"))
        } else {
            const currUser = await User.findOne({where: {id: id}})
            return res.json(currUser)
        }
    }

    async getAll(req, res, next) {
        const usersList = await User.findAndCountAll({
                attributes: {exclude: ['password']},
                limit: 10,
                order: [
                    ['id', 'ASC'],
                    // ['name', 'DESC'],
                ]
            }
        )
        return res.json(usersList)
    }

    async deleteUser(req, res, next) {
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
    }

}

module.exports = new UserController()