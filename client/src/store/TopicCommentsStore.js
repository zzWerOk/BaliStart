import {makeAutoObservable} from "mobx";


export default class TopicCommentsStore {
    constructor() {
        this._comments = {}
        makeAutoObservable(this)
    }

    _getNewCommentId(commentArr) {
        let commentId = 0
        commentArr.map(item => {
            commentId = commentId + 1
            if(item.hasOwnProperty('replies')){
                commentId = commentId + this._getNewCommentId(item.replies)
            }
        })

        return commentId
    }

    _getCommentById(commentArr, commentId) {

        for(let i = 0;i < commentArr.length;i++){
            const currComment = commentArr[i]
            if(currComment.topic_comment_id === commentId){
                return currComment
            }

            if(currComment.hasOwnProperty('replies')){
                const subComment = this._getCommentById(currComment.replies, commentId)
                if(subComment){
                    return subComment
                }
            }
        }

        return null
    }




    getCommentsByTopic(topicTag) {

        return this._comments[topicTag];
    }

    setCommentsByTopic(topicTag, commentsArr) {

        this._comments[topicTag] = commentsArr;
    }

    addCommentToTopic(topicTag, comment) {
        if (!this._comments[topicTag]) {
            this._comments[topicTag] = []
        }
        this._comments[topicTag].push(comment)
    }

    addReplyCommentToTopic(topicTag, comment, replyCommentId) {

        try {
            let replyComment = this._getCommentById(this._comments[topicTag], replyCommentId)
            if (!replyComment.hasOwnProperty('replies')) {
                replyComment.replies = []
            }

            replyComment.replies.push({
                comment
            })
        } catch (e) {
            console.log(e)
        }
    }

    getNewCommentIdByTopic(topicTag) {
        if (!this._comments[topicTag]) {
            this._comments[topicTag] = []
        }
        return this._getNewCommentId(this._comments[topicTag])
    }

    get comments() {
        return this._comments;
    }

    set comments(value) {
        this._comments = value;
    }
}