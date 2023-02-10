import {makeAutoObservable} from "mobx";
import {parse, stringify} from 'flatted';



export default class TopicCommentsStore {
    constructor() {
        this._comments = {}
        makeAutoObservable(this)
    }

    _getNewCommentId(commentArr) {
        let commentId = 0
        commentArr.map(item => {
            commentId = commentId + 1
            if (item.hasOwnProperty('replies')) {
                commentId = commentId + this._getNewCommentId(item.replies)
            }
        })

        return commentId
    }

    _getCommentById(commentArr, commentId) {

        for (let i = 0; i < commentArr.length; i++) {
            const currComment = commentArr[i]
            if (currComment.topic_comment_id === commentId) {
                return currComment
            }

            if (currComment.hasOwnProperty('replies')) {
                const subComment = this._getCommentById(currComment.replies, commentId)
                if (subComment) {
                    return subComment
                }
            }
        }

        return null
    }

    _removeCommentById(commentArr, commentId) {

        for (let i = 0; i < commentArr.length; i++) {
            const currComment = commentArr[i]

            if (currComment.hasOwnProperty('replies')) {
                currComment.replies = this._removeCommentById(currComment.replies, commentId)
            }

            if (currComment.topic_comment_id === commentId) {
                commentArr = commentArr.filter(item => item.topic_comment_id !== commentId);
            }

        }
        return commentArr
    }

    getCommentsByTopic(topicTag) {
        // try {
        //     return parse(stringify(this._comments[topicTag]));
        // }catch (e){
        // console.log(e)
        // console.log(this._comments)
        return parse(this._comments[topicTag])
        // }
    }

    setCommentsByTopic(topicTag, commentsArr) {
        // console.log(commentsArr)

        // console.log(stringify(commentsArr))
        this._comments[topicTag] = stringify(commentsArr);
    }

    deleteCommentByTopic(topicTag, commentId) {

        try {
            // try {
            this._comments[topicTag] = stringify(this._removeCommentById(parse(this._comments[topicTag]), commentId))
            // }catch (e) {
            //     console.log(e)
            //     this._comments[topicTag] = this._removeCommentById(parse(stringify(this._comments[topicTag])), commentId)
            // }
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }

    addCommentToTopic(topicTag, comment, sortCode = true) {
        if (!this._comments[topicTag]) {
            this._comments[topicTag] = '[]'
        }
        let currArr = this.getCommentsByTopic(topicTag)
        if (sortCode) {
            // this._comments[topicTag].push(comment)
            currArr.push(comment)
        } else {
            currArr.unshift(comment)
        }
        this.setCommentsByTopic(topicTag, currArr)
    }

    editCommentOfTopic(topicTag, editCommentId, commentText) {
        try{

            let currArr = this.getCommentsByTopic(topicTag)
            let repliedComment = this._getCommentById(currArr, editCommentId)
            repliedComment.text = commentText
            this.setCommentsByTopic(topicTag, currArr)

        } catch (e) {

        }
    }

    addReplyCommentToTopic(topicTag, replyComment, repliedCommentId, sortCode = true) {
        try {

            let currArr = this.getCommentsByTopic(topicTag)

            let repliedComment = this._getCommentById(currArr, repliedCommentId)
            if (repliedComment) {
                if (!repliedComment.hasOwnProperty('replies')) {
                    repliedComment.replies = []
                }

                if (sortCode) {
                    repliedComment.replies.push(replyComment)
                } else {
                    repliedComment.replies.unshift(replyComment)
                }
            }
            this.setCommentsByTopic(topicTag, currArr)

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