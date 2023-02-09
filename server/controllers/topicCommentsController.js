const {TopicComments, User, Files} = require('../models/models')
const ApiError = require('../error/ApiError')
const path = require("path");
const fs = require("fs");
const {removeFile} = require("../utils/consts");

const convertCommentItemFroTopic = async (commentsItem, currUser) => {
    let convertedItem = {}

    if (commentsItem.hasOwnProperty('created_by_user_id')) {
        const user = await User.findOne({where: {id: commentsItem.created_by_user_id}})
        convertedItem.created_by_user_name = user.name

        if(currUser){
            if(currUser.id === user.id){
                convertedItem.editable = true
            }
        }

    }

    if (commentsItem.hasOwnProperty('text')) {
        convertedItem.text = commentsItem.text
    }

    if (commentsItem.hasOwnProperty('topic_comment_id')) {
        convertedItem.topic_comment_id = commentsItem.topic_comment_id
    }

    if (commentsItem.hasOwnProperty('createdAt')) {
        convertedItem.createdAt = commentsItem.createdAt
    }

    if (commentsItem.hasOwnProperty('replies')) {
        if (Array.isArray(commentsItem.replies)) {
            if (commentsItem.replies.length > 0) {
                convertedItem.replies = commentsItem.replies
            }
        }
    }

    return convertedItem
}
const getCommentReplies = async (commentsIds, topic_id, currUser, sort_code) => {
    let replies = []
    const replyIds = JSON.parse(commentsIds)

    for (let i = 0; i < replyIds.length; i++) {
        const item = replyIds[i]

        const replyComment = await TopicComments.findOne({
            where: {
                topic_comment_id: item,
                topic_id
            },
            // order: [
            //     sortOrder
            //     // ['id', 'ASC'],
            //     // ['name', 'DESC'],
            // ]

        })

        if (replyComment) {
            let newItem = JSON.parse(JSON.stringify(replyComment))
            newItem.replies = await getCommentReplies(newItem.reply_ids, topic_id, currUser, sort_code)

            replies.push(await convertCommentItemFroTopic(newItem, currUser))
        }
    }

    switch (sort_code) {
        case 'date':
            replies.sort(function(a, b){return a.createdAt - b.createdAt});
            break
        case 'redate':
            replies.sort(function(a, b){return b.createdAt - a.createdAt});
            break
        case 'id':
            replies.sort(function(a, b){return a.topic_comment_id - b.topic_comment_id});
            break
        case 'reid':
            replies.sort(function(a, b){return b.topic_comment_id - a.topic_comment_id});
            break
    }



    return replies
}

class TopicCommentsController {

    async addComment(req, res, next) {
        try {
            const {
                text,
                topic_id,
                // topic_comment_id = -1,
                // created_by_user_id,
                on_topic_comment_reply_id = -1,
                is_reply = false,
            } = req.body

            const currUser = req.user
            // file_name: {type: DataTypes.STRING},

            if (text && topic_id && currUser) {

                const topicComments = await TopicComments.findAndCountAll({
                    where: {
                        topic_id
                    },
                })

                const comment = await TopicComments.create({
                    text,
                    topic_id,
                    topic_comment_id: topicComments.count,
                    created_by_user_id: currUser.id,
                    created_date: Date.now(),
                    on_topic_comment_reply_id,
                    is_reply,
                    reply_ids: '[]',
                })


                if (is_reply && on_topic_comment_reply_id > -1) {
                    const candidate = await TopicComments.findOne({
                        where: {
                            topic_comment_id: on_topic_comment_reply_id,
                            topic_id: topic_id,
                        }
                    })
                    if (candidate) {
                        let replyIds = JSON.parse(candidate.reply_ids) || []
                        replyIds.push(comment.topic_comment_id)

                        // candidate.reply_ids = JSON.stringify(replyIds)

                        await TopicComments.update({
                            reply_ids: JSON.stringify(replyIds),
                        }, {
                            where: {
                                id: candidate.id,
                                // topic_comment_id: on_topic_comment_reply_id,
                                // topic_id: topic_id,
                            }
                        })

                        // await candidate.save()
                    }
                }

                return res.json({status: 'ok', id: comment.topic_comment_id})
            } else {
                return next(ApiError.forbidden("Необходимо указать все данные комментария..."))
            }
        } catch (e) {
            return next(ApiError.forbidden("Ошибка добавления комментария"))
        }
    }

    async editComment(req, res, next) {
        try {
            const {
                text,
                topic_id,
                topic_comment_id,
            } = req.body

            const currUser = req.user

            // file_name: {type: DataTypes.STRING},

            if (text && topic_id && currUser) {

                const candidate = await TopicComments.findOne({
                    where: {
                        topic_id,
                        topic_comment_id,
                    }
                })
                if (candidate) {
                    if(candidate.created_by_user_id === currUser.id || currUser.isAdmin) {
                        candidate.text = text

                        candidate.save()

                        return res.json({status: 'ok'})
                    }else{
                        return next(ApiError.forbidden("Нет прав для редактирования"))
                    }
                }

                return res.json({status: 'error', id})
            } else {
                return next(ApiError.forbidden("Необходимо указать все данные комментария..."))
            }
        } catch (e) {
            return next(ApiError.forbidden("Ошибка добавления комментария"))
        }
    }

    async getAll(req, res) {
        const {sort_code='reid', topic_id} = req.query
        const currUser = req.user

        if (topic_id) {

            let sortOrder = ['id', 'DESC']
            switch (sort_code) {
                case 'user':
                    sortOrder = ['created_by_user_id', 'ASC']
                    break
                case 'reuser':
                    sortOrder = ['created_by_user_id', 'DESC']
                    break
                case 'date':
                    sortOrder = ['created_date', 'ASC']
                    break
                case 'redate':
                    sortOrder = ['created_date', 'DESC']
                    break
                case 'id':
                    sortOrder = ['id', 'ASC']
                    break
                case 'reid':
                    sortOrder = ['id', 'DESC']
                    break
            }

            const commentsList = await TopicComments.findAndCountAll({
                    where: {
                        is_reply: false,
                        topic_id
                    },
                    limit: 10,
                    order: [
                        sortOrder
                        // ['id', 'ASC'],
                        // ['name', 'DESC'],
                    ]
                }
            )
            let newRows = []

            for (let i = 0; i < commentsList.count; i++) {
                const item = commentsList.rows[i]

                let newItem = JSON.parse(JSON.stringify(item))

                if (newItem.reply_ids) {
                    newItem.replies = await getCommentReplies(newItem.reply_ids || '[]', newItem.topic_id, currUser, sort_code)
                }

                newRows.push(await convertCommentItemFroTopic(newItem, currUser))
            }

            return res.json({
                count: newRows.length,
                'rows': newRows
            })
        }
        return res.json({status: "error", message: `Param error`})

        // return res.json(commentsList)
    }


    async deleteComment(req, res, next) {
        const {id} = req.query
        const currUser = req.user

        try {
            if (!id) {
                return next(ApiError.badRequest("Ошибка параметра"))
            } else {

                const candidate = await TopicComments.findOne({where: {id}})

                if (candidate) {

                    if(candidate.created_by_user_id === currUser.id || currUser.isAdmin) {

                        try {
                            let imgFileName = candidate.file_name.split('\\')[1]
                            const imgFilePath = path.resolve(__dirname, '..', "static", imgFileName)
                            fs.unlinkSync(imgFilePath)
                        } catch (e) {
                        }

                        const result = removeFile(candidate.file_name)
                        if (result.hasOwnProperty('status')) {
                            if (result.status === 'ok') {

                                await Files.destroy({
                                    where: {
                                        table_name: 'TopicComments',
                                        file_name: candidate.file_name
                                    }
                                })

                                if (candidate.is_reply && candidate.on_topic_comment_reply_id > -1) {
                                    const replyCandidate = await TopicComments.findOne({where: {id: candidate.on_topic_comment_reply_id}})
                                    if (replyCandidate) {
                                        let replyIds = JSON.parse(replyCandidate.reply_ids)
                                        replyIds.push(candidate.id)

                                        const filtered = replyIds.filter(function (value) {
                                            return ("" + value.id) === ("" + candidate.id)
                                        })

                                        replyCandidate.reply_ids = JSON.stringify(filtered)
                                        replyCandidate.save()
                                    }
                                }

                                const count = await TopicComments.destroy({where: {id: id}})
                                return res.json({status: "ok", message: `Удалено записей: ${count}`})
                            }
                        }
                    }else{
                        return next(ApiError.forbidden("Нет прав для удаления"))
                    }
                }
            }
        } catch (e) {
            return res.json({status: "error", message: e.message})
        }
        return next(ApiError.internal("Ошибка удаления"))

    }


}

module.exports = new TopicCommentsController()