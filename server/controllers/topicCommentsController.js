const {TopicComments, User, Files} = require('../models/models')
const ApiError = require('../error/ApiError')
const path = require("path");
const fs = require("fs");
const {removeFile} = require("../utils/consts");

const getCommentReplies = (commentsIds) => {
    let replies = []
    const replyIds = JSON.parse(commentsIds)
    replyIds.map(item => {
        const replyComment = TopicComments.findOne({
            where: {
                id: item
            }
        })
        if(replyComment){
            replyComment.replies = getCommentReplies(replyComment.reply_ids)

            replies.push(replyComment)
        }
    })

    return replies
}

class TopicCommentsController {

    async addComment(req, res, next) {
        try {
            const {
                text,
                topic_id,
                topic_comment_id,
                created_by_user_id,
                on_topic_comment_reply_id = -1,
                is_reply = false,
            } = req.body

            // reply_ids: {type: DataTypes.STRING},
            // on_topic_comment_reply_id: {type: DataTypes.INTEGER},
            // is_reply: {type: DataTypes.BOOLEAN, defaultValue: false},

            // file_name: {type: DataTypes.STRING},

            if (text && topic_id && topic_comment_id && created_by_user_id) {
                const comment = await TopicComments.create({
                    text,
                    topic_id,
                    topic_comment_id,
                    created_by_user_id,
                    created_date: Date.now(),
                })

                if (is_reply && on_topic_comment_reply_id > -1) {
                    const candidate = await TopicComments.findOne({where: {id: on_topic_comment_reply_id}})
                    if (candidate) {
                        let replyIds = JSON.parse(candidate.reply_ids)
                        replyIds.push(comment.id)

                        candidate.reply_ids = JSON.stringify(replyIds)
                        candidate.save()
                    }
                }

                return res.json({status: 'ok', id: comment.id})
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
                id,
                text,
                topic_id,
                topic_comment_id,
                created_by_user_id,
            } = req.body

            // file_name: {type: DataTypes.STRING},

            if (id && text && topic_id && topic_comment_id && created_by_user_id) {

                const candidate = await TopicComments.findOne({where: {id}})
                if (candidate) {
                    candidate.text = text

                    candidate.save()

                    return res.json({status: 'ok', id: comment.id})
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
        const {sort_code, topic_id} = req.query

        if(topic_id) {

            let sortOrder = ['id', 'ASC']
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

            commentsList.rows.map(item => {
                let newItem = JSON.parse(JSON.stringify(item))

                const user = User.findOne({where: {id: newItem.created_by_user_id}})

                newItem.created_by_user_name = user.name

                if (newItem.reply_ids) {
                    newItem.replies = getCommentReplies(newItem.reply_ids)

                    // const replyIds = JSON.parse(newItem.reply_ids)
                    // replyIds.map(item => {
                    //     const replyComment = TopicComments.findOne({
                    //         where: {
                    //             id: item
                    //         }
                    //     })
                    //     if(replyComment){
                    //         newItem.replies.push(replyComment)
                    //     }
                    // })
                }

                newRows.push(newItem)

            })

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
        try {
            if (!id) {
                return next(ApiError.badRequest("Ошибка параметра"))
            } else {

                const candidate = await TopicComments.findOne({where: {id}})

                if (candidate) {

                    try {
                        let imgFileName = candidate.file_name.split('\\')[1]
                        const imgFilePath = path.resolve(__dirname, '..', "static", imgFileName)
                        fs.unlinkSync(imgFilePath)
                    } catch (e) {
                    }

                    const result = removeFile(candidate.file_name)
                    if (result.hasOwnProperty('status')) {
                        if (result.status === 'ok') {

                            await Files.destroy({where: {table_name: 'TopicComments', file_name: candidate.file_name}})

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
                }
            }
        } catch (e) {
            return res.json({status: "error", message: e.message})
        }
        return next(ApiError.internal("Ошибка удаления"))

    }


}

module.exports = new TopicCommentsController()