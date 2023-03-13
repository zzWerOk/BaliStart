const {User, Messages} = require('../models/models')
const ApiError = require('../error/ApiError')


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
                    const newMessage = await Messages.create({userIdFrom: currUser.id, userIdTo, message})

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

                    if(currId !== currUser.id) {

                        const selectedUser = await User.findOne({
                            where: {
                                id: currId,
                            },
                            attributes: ['name', 'id', 'avatar_img'],
                        })

                        if (selectedUser) {
                            const fromUserMessages = await Messages.findOne({
                                where: {
                                    userIdFrom: selectedUser.id,
                                    userIdTo: currUser.id,
                                },
                                order: [['createdAt', 'DESC']],
                                attributes: ['message', 'createdAt', 'seen'],
                            })

                            let lastMessageText = ''
                            let lastMessageDate = ''
                            let lastMessageStatus = 'to'
                            let lastMessageSeen = false

                            const toUserMessages = await Messages.findOne({
                                where: {
                                    userIdFrom: currUser.id,
                                    userIdTo: selectedUser.id,
                                },
                                order: [['createdAt', 'DESC']],
                                attributes: ['message', 'createdAt'],
                            })

                            if (fromUserMessages && fromUserMessages.createdAt >= toUserMessages?.createdAt) {
                                lastMessageText = fromUserMessages.message
                                lastMessageDate = fromUserMessages.createdAt
                                lastMessageSeen = fromUserMessages.seen
                            }else if (toUserMessages) {
                                lastMessageText = toUserMessages.message
                                lastMessageDate = toUserMessages.createdAt
                                lastMessageSeen = toUserMessages.seen
                                lastMessageStatus = 'from'
                            }

                            usersIds.push({
                                userId: currId,
                                userName: selectedUser.name,
                                userImg: selectedUser.avatar_img,
                                lastMessage: lastMessageText,
                                lastMessageDate,
                                lastMessageStatus,
                                read: lastMessageSeen
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
                    // order: [['createdAt', 'DESC']],
                })

                // const toUserMessages = await Messages.findAll({
                //     where: {
                //         userIdFrom: chatUserId,
                //         userIdTo: currUser.id,
                //     }
                // })

                return res.json({status: 'ok', data: fromUserMessages})
            } else {
                return next(ApiError.forbidden("Необходимо указать все данные сообщения..."))
            }
        } catch (e) {
            return next(ApiError.internal("Ошибка " + e.message))
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