const {TableUpdates, Guide, User} = require("../models/models");
const ApiError = require("../error/ApiError");
const {readFile, createNewFile} = require("../utils/consts");
const path = require("path");

class GuideController {

    async create(req, res) {
        const {
            user_id,
            avatar_img,
            name,
            about,
            religion,
            experience,
            active_till,
            visible_till,
            phones,
            links,
            email,
            is_has_car,
            languages,
            tours_ids,
            is_emergency_help,
            emergency_help_price,
            is_can_discount,
            holidays,
        } = req.body

        try {

            if (user_id !== null) {
                if (user_id !== undefined) {

                    const candidate = await Guide.findOne({where: {user_id}})

                    if (!candidate) {
                        const guide = await Guide.create({
                            user_id,
                            avatar_img,
                            name,
                            about,
                            religion,
                            experience,
                            active_till,
                            visible_till,
                            phones,
                            links,
                            email,
                            is_has_car,
                            languages,
                            tours_ids,
                            is_emergency_help,
                            emergency_help_price,
                            is_can_discount,
                            holidays,
                        })

                        if (guide) {
                            /**
                             Обновление таблиц
                             **/
                            await TableUpdates.upsert({table_name: 'Guides', date: Date.now()})
                            return res.json({status: 'ok'})
                        }
                    } else {
                        return res.json({status: 'ok', message: 'User already a guide'})
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
            try {
                const {
                    name,
                    about,
                    religion,
                    experience,
                    languages,
                    phones,
                    links,
                    // avatar_img,
                } = req.body
                const currUser = req.user

                let userEmail = null
                let userAvatar = ''
                let guideLanguages
                let guidePhones
                let guideLinks

                if (languages === null || languages === undefined || languages === '') {
                    guideLanguages = '[]'
                } else {
                    guideLanguages = languages
                }

                if (phones === null || phones === undefined || phones === '') {
                    guidePhones = '[]'
                } else {
                    guidePhones = phones
                }

                if (links === null || links === undefined || links === '') {
                    guideLinks = '[]'
                } else {
                    guideLinks = links
                }

                if (currUser) {
                    let candidate = await Guide.findOne({
                        where: {
                            user_id: currUser.id
                        }
                    })
                    /** Если пользователь не зарегистрирован как гид *
                     * регистрируем его **/
                    if (!candidate) {
                        const updatedUser = await User.findOne({
                            attributes: {exclude: ['password']},
                            where: {
                                id: currUser.id
                            }
                        })

                        userEmail = updatedUser.email || ''
                        userAvatar = updatedUser.avatar_img || ''

                        candidate = await Guide.create({
                            user_id: updatedUser.id,
                            avatar_img: userAvatar,
                            name,
                            about,
                            religion,
                            experience,
                            active_till: 0,
                            visible_till: 0,
                            phones: guidePhones,
                            links: guideLinks,
                            languages: guideLanguages,
                            email: userEmail,
                            is_has_car: false,
                            tours_ids: 0,
                            is_emergency_help: false,
                            emergency_help_price: 0,
                            is_can_discount: false,
                            holidays: 0,
                        })
                    }
                    /** **/

                    if (candidate) {

                        let imgFileName = candidate.avatar_img
                        if (!imgFileName || imgFileName === '') {
                            imgFileName = userAvatar
                        }

                        let img = null
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
                            await Guide.update(
                                {
                                    avatar_img: imgFileName,
                                    name,
                                    about,
                                    religion,
                                    experience,
                                    phones: guidePhones,
                                    links: guideLinks,
                                    languages: guideLanguages,
                                },
                                {
                                    where: {id: candidate.id},
                                }
                            );
                        }

                        if (img) {
                            return res.json({status: 'ok', avatar_img: imgFileName})
                        } else {
                            return res.json({status: 'ok'})
                        }


                    } else {
                        return res.json({status: 'error', message: "No user found"})
                    }
                }

                return res.json({status: 'error', message: "Необходимо указать все данные пользователя..."})
            } catch (e) {
                return res.json({status: 'error', message: e.message})
            }
        } catch (e) {
        }

    }

    async changeAdmin(req, res) {
        try {
            const {
                user_id,
                name,
                about,
                religion,
                experience,
                active_till,
                visible_till,
                phones,
                links,
                languages,
            } = req.body

            let userEmail = null
            let userAvatar = ''
            let guideLanguages
            let guidePhones
            let guideLinks

            if (languages === null || languages === undefined || languages === '') {
                guideLanguages = '[]'
            } else {
                guideLanguages = languages
            }

            if (phones === null || phones === undefined || phones === '') {
                guidePhones = '[]'
            } else {
                guidePhones = phones
            }

            if (links === null || links === undefined || links === '') {
                guideLinks = '[]'
            } else {
                guideLinks = links
            }

            if (user_id) {
                let candidate = await Guide.findOne({where: {user_id}})
                /** Если пользователь не зарегистрирован как гид *
                 * регистрируем его **/
                if (!candidate) {
                    const updatedUser = await User.findOne({
                        attributes: {exclude: ['password']},
                        where: {id: user_id}
                    })

                    userEmail = updatedUser.email || ''
                    userAvatar = updatedUser.avatar_img || ''

                    candidate = await Guide.create({
                        user_id,
                        avatar_img: userAvatar,
                        name,
                        about,
                        religion,
                        experience,
                        active_till,
                        visible_till,
                        phones: guidePhones,
                        links: guideLinks,
                        languages: guideLanguages,
                        email: userEmail,
                        is_has_car: false,
                        tours_ids: 0,
                        is_emergency_help: false,
                        emergency_help_price: 0,
                        is_can_discount: false,
                        holidays: 0,
                    })
                }

                /** Если пользователь не зарегистрирован как гид *
                 * регистрируем его **/
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
                        await Guide.update(
                            {
                                avatar_img: imgFileName,
                                name,
                                about,
                                religion,
                                experience,
                                active_till,
                                visible_till,
                                phones: guidePhones,
                                links: guideLinks,
                                languages: guideLanguages,
                            },
                            {
                                where: {id: candidate.id},
                            }
                        );
                    }

                    const selectedByUser = req.user
                    candidate = await Guide.findOne({where: {user_id}})

                    const guideDataJson = JSON.parse(JSON.stringify(candidate))
                    if ((candidate.id + '') === (selectedByUser.id + '')) {
                        guideDataJson.editable = true
                    }

                    // about
                    // active_till
                    // avatar_img
                    // createdAt
                    // experience
                    // id
                    // languages
                    // name
                    // phones
                    // religion
                    // updatedAt
                    // user_id
                    // visible_till

                    if (guideDataJson.links === null || guideDataJson.links === undefined || guideDataJson.links === '') {
                        guideDataJson.links = '[]'
                    }


                    delete guideDataJson.editable
                    delete guideDataJson.email
                    delete guideDataJson.emergency_help_price
                    delete guideDataJson.holidays
                    delete guideDataJson.is_can_discount
                    delete guideDataJson.is_emergency_help
                    delete guideDataJson.is_has_car
                    delete guideDataJson.tours_ids
                    delete guideDataJson.userId

                    return res.json({status: 'ok', data: guideDataJson})

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
                const currGuide = await Guide.findOne({where: {user_id: id}})
                if (!currGuide) {
                    const currUser = await User.findOne({where: {id: id}})

                    let guideName = ''
                    let guideAvatar = ''

                    if (currUser) {
                        guideName = currUser.name
                        guideAvatar = currUser.avatar_img
                    }

                    return res.json({
                        status: 'ok', data: {
                            user_id: id,
                            avatar_img: guideAvatar,
                            name: guideName,
                            about: '',
                            religion: '',
                            experience: 0,
                            active_till: 0,
                            visible_till: 0,
                            phones: [],
                            links: [],
                            languages: [],
                        }
                    })
                }

                const selectedByUser = req.user

                const guideDataJson = JSON.parse(JSON.stringify(currGuide))
                if ((currGuide.id + '') === (selectedByUser.id + '')) {
                    guideDataJson.editable = true
                }

                // about
                // active_till
                // avatar_img
                // createdAt
                // experience
                // id
                // languages
                // name
                // phones
                // religion
                // updatedAt
                // user_id
                // visible_till

                // delete guideDataJson.editable
                delete guideDataJson.email
                delete guideDataJson.emergency_help_price
                delete guideDataJson.holidays
                delete guideDataJson.is_can_discount
                delete guideDataJson.is_emergency_help
                delete guideDataJson.is_has_car
                delete guideDataJson.tours_ids
                delete guideDataJson.userId


                // return res.json({status: 'ok', data: currGuide})
                return res.json({status: 'ok', data: guideDataJson})
            }
        } catch (e) {
            return res.json({status: 'error', data: e.message})
        }
        // return res.json({status: 'error'})
    }

    async getGuideById(req, res, next) {
        try {
            // const {id} = req.params
            const currUser = req.user

            if (!currUser) {
                return next(ApiError.badRequest("Ошибка параметра"))
            } else {
                const currGuide = await Guide.findOne({where: {user_id: currUser.id}})
                if (!currGuide) {
                    const currGuideUser = await User.findOne({where: {id: currUser.id}})

                    let guideName = ''
                    let guideAvatar = ''

                    if (currGuideUser) {
                        guideName = currGuideUser.name
                        guideAvatar = currGuideUser.avatar_img
                    }

                    return res.json({
                        status: 'ok', data: {
                            // user_id: currUser.id,
                            avatar_img: guideAvatar,
                            name: guideName,
                            about: '',
                            religion: '',
                            experience: 0,
                            active_till: 0,
                            visible_till: 0,
                            phones: [],
                            links: [],
                            languages: [],
                        }
                    })
                }

                // const selectedByUser = req.user

                const guideDataJson = JSON.parse(JSON.stringify(currGuide))
                // if ((currGuide.id + '') === (selectedByUser.id + '')) {
                //     guideDataJson.editable = true
                // }

                // about
                // active_till
                // avatar_img
                // createdAt
                // experience
                // id
                // languages
                // name
                // phones
                // religion
                // updatedAt
                // user_id
                // visible_till

                // delete guideDataJson.editable
                delete guideDataJson.id
                delete guideDataJson.user_id
                delete guideDataJson.email
                delete guideDataJson.emergency_help_price
                delete guideDataJson.holidays
                delete guideDataJson.is_can_discount
                delete guideDataJson.is_emergency_help
                delete guideDataJson.is_has_car
                delete guideDataJson.tours_ids


                // return res.json({status: 'ok', data: currGuide})
                return res.json({status: 'ok', data: guideDataJson})
            }
        } catch (e) {
            return res.json({status: 'error', data: e.message})
        }
        // return res.json({status: 'error'})
    }

    async deleteGuide(req, res) {
        try {
            /**
             Обновление таблиц
             **/
            await TableUpdates.upsert({table_name: 'Guides', date: Date.now()})
        } catch (e) {
        }

    }

}

module.exports = new GuideController()