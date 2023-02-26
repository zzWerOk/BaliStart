const {TableUpdates, User, Agent} = require("../models/models");
const ApiError = require("../error/ApiError");
const {readFile, createNewFile} = require("../utils/consts");
const path = require("path");

class AgentController {

    async create(req, res) {
        const {
            user_id,
            avatar_img,
            name,
            about,
            active_till,
            visible_till,
            phones,
            links,
            email,
            languages,
        } = req.body

        try {

            if (user_id !== null) {
                if (user_id !== undefined) {

                    const candidate = await Agent.findOne({where: {user_id}})

                    if (!candidate) {
                        const agent = await Agent.create({
                            user_id,
                            avatar_img,
                            name,
                            about,
                            active_till,
                            visible_till,
                            phones,
                            links,
                            email,
                            languages,
                        })

                        if (agent) {
                            /**
                             Обновление таблиц
                             **/
                            await TableUpdates.upsert({table_name: 'Agents', date: Date.now()})
                            return res.json({status: 'ok'})
                        }
                    } else {
                        return res.json({status: 'ok', message: 'User already a agent'})
                    }
                }
            }
            return res.json({status: 'error', message: 'No params'})

        } catch (e) {
            return res.json({status: 'error', message: e.message})
        }

    }

    async change(req, res) {
        try {
            /**
             Обновление таблиц
             **/
            await TableUpdates.upsert({table_name: 'Agents', date: Date.now()})
        } catch (e) {
        }

    }

    async changeAdmin(req, res) {
        try {
            const {
                user_id,
                name,
                about,
                active_till,
                visible_till,
                phones,
                links,
                languages,
            } = req.body

            let userEmail = null
            let userAvatar = ''
            let agentLanguages
            let agentPhones
            let agentLinks
            let agentActiveTill = active_till || 0
            let agentVisibleTill = visible_till || 0

            if (languages === null || languages === undefined || languages === '') {
                agentLanguages = '[]'
            } else {
                agentLanguages = languages
            }

            if (phones === null || phones === undefined || phones === '') {
                agentPhones = '[]'
            } else {
                agentPhones = phones
            }

            if (links === null || links === undefined || links === '') {
                agentLinks = '[]'
            } else {
                agentLinks = links
            }

            if (user_id) {
                let candidate = await Agent.findOne({where: {user_id}})
                /** Если пользователь не зарегистрирован как агент *
                 * регистрируем его **/
                if (!candidate) {
                    // try {

                        const updatedUser = await User.findOne({
                            attributes: {exclude: ['password']},
                            where: {id: user_id}
                        })

                        userEmail = updatedUser.email || ''
                        userAvatar = updatedUser.avatar_img || ''

                        candidate = await Agent.create({
                            user_id,
                            avatar_img: userAvatar,
                            name,
                            about,
                            active_till: agentActiveTill,
                            visible_till: agentVisibleTill,
                            phones: agentPhones,
                            links: agentLinks,
                            languages: agentLanguages,
                            email: userEmail,
                        })

                        // user_id: {type: DataTypes.INTEGER, allowNull: false},
                        // avatar_img: {type: DataTypes.STRING},
                        // name: {type: DataTypes.STRING},
                        // about: {type: DataTypes.STRING},
                        // active_till: {type: DataTypes.BIGINT, defaultValue:0 ,allowNull: false},
                        // visible_till: {type: DataTypes.BIGINT, defaultValue:0 ,allowNull: false},
                        // phones: {type: DataTypes.STRING},
                        // links: {type: DataTypes.STRING},
                        // email: {type: DataTypes.STRING},
                        // languages: {type: DataTypes.STRING, allowNull: false},



                    // } catch (e) {
                    //     return res.json({status: 'error1', message: e.message})
                    // }
                }

                if (candidate) {

                    let imgFileName = candidate.avatar_img
                    if (!imgFileName || imgFileName === '') {
                        imgFileName = userAvatar
                    }

                    let img
                    if (req.files) {
                        img = req.files.img

                        const userImageFile = readFile(candidate.avatar_img)
                        if (!userImageFile || candidate.avatar_img === '') {

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
                                imgFileName = candidate.avatar_img.substring(candidate.avatar_img.lastIndexOf("/") + 1, candidate.avatar_img.length);
                                await img.mv(path.resolve(__dirname, '..', "static", imgFileName))
                            }

                        }
                    }

                    if (userEmail === null) {
                        await Agent.update(
                            {
                                avatar_img: imgFileName,
                                name,
                                about,
                                active_till,
                                visible_till,
                                phones: agentPhones,
                                links: agentLinks,
                                languages: agentLanguages,
                            },
                            {
                                where: {id: candidate.id},
                            }
                        );
                    }

                    const selectedByUser = req.user
                    candidate = await Agent.findOne({where: {user_id}})

                    const agentDataJson = JSON.parse(JSON.stringify(candidate))
                    if ((candidate.id + '') === (selectedByUser.id + '')) {
                        agentDataJson.editable = true
                    }

                    delete agentDataJson.editable
                    delete agentDataJson.email
                    delete agentDataJson.emergency_help_price
                    delete agentDataJson.holidays
                    delete agentDataJson.is_can_discount
                    delete agentDataJson.is_emergency_help
                    delete agentDataJson.is_has_car
                    delete agentDataJson.tours_ids
                    delete agentDataJson.userId

                    return res.json({status: 'ok', data: agentDataJson})

                } else {
                    return res.json({status: 'error', message: "No user found"})
                }
            }

            return res.json({status: 'error', message: "Необходимо указать все данные пользователя..."})
        } catch (e) {
            return res.json({status: 'error', message: e.message})
        }
    }

    async getAll(req, res) {

    }

    async getById(req, res, next) {
        // const {id} = req.query
        try {
            const {id} = req.params

            if (!id) {
                return next(ApiError.badRequest("Ошибка параметра"))
            } else {
                const currAgent = await Agent.findOne({where: {user_id: id}})
                if (!currAgent) {
                    const currUser = await User.findOne({where: {id: id}})

                    let agentName = ''
                    let agentAvatar = ''

                    if (currUser) {
                        agentName = currUser.name
                        agentAvatar = currUser.avatar_img
                    }

                    return res.json({
                        status: 'ok', data: {
                            user_id: id,
                            avatar_img: agentAvatar,
                            name: agentName,
                            about: '',
                            active_till: 0,
                            visible_till: 0,
                            phones: [],
                            links: [],
                            languages: [],
                        }
                    })
                }

                const selectedByUser = req.user

                const agentDataJson = JSON.parse(JSON.stringify(currAgent))
                if ((currAgent.id + '') === (selectedByUser.id + '')) {
                    agentDataJson.editable = true
                }

                delete agentDataJson.email

                return res.json({status: 'ok', data: agentDataJson})
            }
        } catch (e) {
            return res.json({status: 'error', data: e.message})
        }
        // return res.json({status: 'error'})
    }

    async deleteAgent(req, res) {
        try {
            /**
             Обновление таблиц
             **/
            await TableUpdates.upsert({table_name: 'Agents', date: Date.now()})
        } catch (e) {
        }

    }

}

module.exports = new AgentController()