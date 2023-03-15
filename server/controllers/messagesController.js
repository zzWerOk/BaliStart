const {User, Messages} = require('../models/models')
const ApiError = require('../error/ApiError')
const {dateToEpoch} = require("../utils/consts");
const {Op} = require("sequelize");


class MessagesController {

    async create(req, res, next) {
        try {
            const {userIdTo, message} = req.body
            const currUser = req.user

            if (currUser && userIdTo !== null && message) {
                const candidateFrom = await User.findOne({
                    where: {
                        id: currUser.id
                    }
                })
                const candidateTo = await User.findOne({
                    where: {
                        id: userIdTo
                    }
                })

                if (candidateFrom && candidateTo) {
                    const newMessage = await Messages.create({
                        userIdFrom: currUser.id,
                        userIdTo,
                        message,
                        seenFrom: true
                    })

                    if (newMessage) {
                        return res.json({status: 'ok', data: newMessage.id})
                    }

                }
                return next(ApiError.badRequest("Ошибка сохранения сообщения"))
            } else {
                return next(ApiError.forbidden("Необходимо указать все данные сообщения..."))
            }
        } catch (e) {
            return next(ApiError.forbidden("Ошибка " + e.message))
        }
    }

    async setMessagesSeen(req, res, next) {
        try {
            const {messagesIds} = req.body
            const currUser = req.user

            const messagesIdsArr = JSON.parse(messagesIds)

            if (messagesIdsArr && messagesIdsArr?.length > 0) {

                for (let i = 0; i < messagesIdsArr.length; i++) {
                    const currId = messagesIdsArr[i]
                    await Messages.update(
                        {
                            seenFrom: true,
                        },
                        {
                            where: {
                                id: currId,
                                userIdFrom: currUser.id,
                            },
                        }
                    )
                    await Messages.update(
                        {
                            seenTo: true,
                        },
                        {
                            where: {
                                id: currId,
                                userIdTo: currUser.id,
                            },
                        }
                    )
                }

                return res.json({status: 'ok'})
                // return next(ApiError.badRequest("Ошибка сохранения сообщения"))
            }
            // else {
            return next(ApiError.forbidden("Необходимо указать все данные сообщения..."))
            // }
        } catch (e) {
            return next(ApiError.forbidden("Ошибка " + e.message))
        }
    }

    async getChatUsers(req, res, next) {
        try {
            const currUser = req.user
            if (currUser) {

                const fromUserMessages = await Messages.findAll({
                    where: {
                        userIdFrom: currUser.id
                    },
                    attributes: ['userIdTo'],
                    group: "userIdTo",
                })
                const toUserMessages = await Messages.findAll({
                    where: {
                        userIdTo: currUser.id
                    },
                    attributes: ['userIdFrom'],
                    group: "userIdFrom",
                })

                let usersIds = []

                fromUserMessages.map(item => {
                    usersIds.push(item.userIdTo)
                })
                toUserMessages.map(item => {
                    usersIds.push(item.userIdFrom)
                })

                let uniqueIds = [...new Set(usersIds)];
                usersIds = []

                uniqueIds.reverse()

                for (let i = 0; i < uniqueIds.length; i++) {
                    const currId = uniqueIds[i]

                    if (currId !== currUser.id) {

                        const selectedUser = await User.findOne({
                            where: {
                                id: currId,
                            },
                            attributes: ['name', 'id', 'avatar_img'],
                        })

                        if (selectedUser) {
                            const fromUserMessage = await Messages.findOne({
                                where: {
                                    userIdFrom: selectedUser.id,
                                    userIdTo: currUser.id,
                                },
                                order: [['createdAt', 'DESC']],
                                attributes: ['message', 'createdAt', 'seenFrom', 'seenTo'],
                            })

                            let lastMessageText = ''
                            let lastMessageDate = ''
                            // let lastMessageStatus = 'to'
                            let lastMessageSeen = false

                            const toUserMessage = await Messages.findOne({
                                where: {
                                    userIdFrom: currUser.id,
                                    userIdTo: selectedUser.id,
                                },
                                order: [['createdAt', 'DESC']],
                                attributes: ['message', 'createdAt', 'seenFrom', 'seenTo'],
                            })

                            const fromUserMessagesEpoch = dateToEpoch(fromUserMessage?.createdAt || 0)
                            const toUserMessagesEpoch = dateToEpoch(toUserMessage?.createdAt || 0)

                            if (toUserMessage && fromUserMessagesEpoch < toUserMessagesEpoch) {
                                lastMessageText = toUserMessage.message
                                lastMessageDate = toUserMessagesEpoch
                                lastMessageSeen = toUserMessage.seenFrom
                            } else if (fromUserMessage) {
                                lastMessageText = fromUserMessage.message
                                lastMessageDate = fromUserMessagesEpoch
                                lastMessageSeen = fromUserMessage.seenTo
                            }

                            usersIds.push({
                                userId: currId,
                                userName: selectedUser.name,
                                userImg: selectedUser.avatar_img,
                                lastMessage: lastMessageText,
                                read: lastMessageSeen,
                                lastMessageDate,
                            })
                        }
                    }
                }

                return res.json({status: 'ok', data: usersIds})
            } else {
                return next(ApiError.forbidden("Необходимо указать все данные сообщения..."))
            }
        } catch (e) {
            return next(ApiError.internal("Ошибка " + e.message))
        }
    }

    async get(req, res, next) {
        try {
            const {chatUserId} = req.params
            const currUser = req.user
            if (currUser && chatUserId) {

                const fromUserMessages = await Messages.findAndCountAll({
                    where: {
                        userIdFrom: [currUser.id, chatUserId],
                        userIdTo: [chatUserId, currUser.id],

                    },
                    limit: 10,
                    order: [['createdAt', 'DESC']],
                })

                const newData = {
                    count: fromUserMessages.count,
                    rows: fromUserMessages.rows.reverse()
                }

                // const toUserMessages = await Messages.findAll({
                //     where: {
                //         userIdFrom: chatUserId,
                //         userIdTo: currUser.id,
                //     }
                // })

                return res.json({status: 'ok', data: newData})
            } else {
                return next(ApiError.forbidden("Необходимо указать все данные сообщения..."))
            }
        } catch (e) {
            return next(ApiError.internal("Ошибка " + e.message))
        }
    }

    async getNewMessages(req, res, next) {
        try {
            const {dateBefore, chatUserId} = req.query
            const currUser = req.user

            if (currUser && chatUserId && dateBefore) {

                const fromUserMessages = await Messages.findAndCountAll({
                    where: {
                        userIdFrom: [currUser.id, chatUserId],
                        userIdTo: [chatUserId, currUser.id],
                        createdAt: {
                            [Op.gt]: (dateBefore * 1000),
                            [Op.lt]: new Date(),
                        },

                    },
                    // limit: 10,
                    order: [['createdAt', 'DESC']],
                })

                const newData = {
                    count: fromUserMessages.count,
                    rows: fromUserMessages.rows.reverse()
                }

                return res.json({status: 'ok', data: newData})
            } else {
                return next(ApiError.forbidden("Необходимо указать все данные сообщения..."))
            }
        } catch (e) {
            return next(ApiError.internal("Ошибка " + e.message))
        }
    }

    async checkNewMessages(req, res, next) {
        try {
            // const {dateBefore, chatUserId} = req.query
            const currUser = req.user

            if (currUser) {

                // const fromUserMessages = await Messages.findAndCountAll({
                const fromUserMessages = await Messages.findOne({
                    where: {
                        [Op.or]: [
                            // {userIdFrom: currUser.id},
                            {userIdTo: currUser.id}
                        ],
                        seenTo: false,

                        // // userIdFrom:{
                        // //     [Op.or]: currUser.id
                        // // },
                        // // userIdTo:{
                        // //     [Op.or]: currUser.id
                        // // },
                        //
                        // createdAt: {
                        //     [Op.gt]: (new Date() - 3600),
                        //     [Op.lt]: new Date(),
                        // },
                        // [Op.or]: [
                        //     {
                        //         userIdFrom: currUser.id,
                        //         seenFrom: false
                        //     },
                        //     {
                        //         userIdTo: currUser.id,
                        //         seenTo: false
                        //     }
                        // ]
                        // // seenFrom:{
                        // //     [Op.or]: false
                        // // },
                        // // seenTo:{
                        // //     [Op.or]: false
                        // // },
                    },
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                })


                console.log('')
                console.log('')
                console.log(currUser)
                console.log('')
                console.log('')
                console.log('')



                const newData = {
                    // count: fromUserMessages.count,
                    count: fromUserMessages ? 1 : 0,
                    // rows: fromUserMessages.rows.reverse()
                    rows: fromUserMessages
                }

                return res.json({status: 'ok', data: newData})
            } else {
                return next(ApiError.forbidden("Необходимо указать все данные сообщения..."))
            }
        } catch (e) {
            return next(ApiError.internal("Ошибка! " + e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params

            if (!id) {
                return next(ApiError.badRequest("Ошибка параметра"))
            } else {

                const count = await Messages.destroy({where: {id: id}})
                return res.json(`Удалено записей: ${count}`)
            }
        } catch (e) {
            return next(ApiError.forbidden("Ошибка добавления пользователя"))
        }
    }

}

module.exports = new MessagesController()