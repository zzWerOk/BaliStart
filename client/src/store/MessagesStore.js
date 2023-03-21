import {makeAutoObservable} from "mobx";

export default class MessagesStore {

    constructor() {
        this._onMessageSend = null
        this._onNewMessageTrigger = null
        this._onNewMessageNavTrigger = null
        this._onNewMessageTriggerChatUsers = []
        this._onMessageDeleted = null
        this._onMessageDeletedTrigger = null
        this._onMessageEdited = null
        this._onMessageEditedTrigger = null


        makeAutoObservable(this)
    }


    set onMessageEdited(value) {
        this._onMessageEdited = value;
    }

    set onMessageEditedTrigger(value) {
        this._onMessageEditedTrigger = value;
    }

    set onMessageDeleted(value) {
        this._onMessageDeleted = value;
    }

    set onMessageDeletedTrigger(value) {
        this._onMessageDeletedTrigger = value;
    }

    set onNewMessageNavTrigger(value) {
        this._onNewMessageNavTrigger = value;
    }

    set onNewMessageTriggerChatUsers(value) {
        // this._onNewMessageTriggerChatUsers = value;
        if (!this._onNewMessageTriggerChatUsers.includes(value)) {
            this._onNewMessageTriggerChatUsers.push(value)
        }
    }

    removeFromNewMessageTriggerChatUsers(value) {
        this._onNewMessageTriggerChatUsers.splice(this._onNewMessageTriggerChatUsers.indexOf(value), 1)
    }

    set onNewMessageTrigger(value) {
        this._onNewMessageTrigger = value;
    }

    set onMessageSend(value) {
        this._onMessageSend = value;
    }

    sendMessage(recipient, text) {

        if (this._onMessageSend !== null && this._onMessageSend !== undefined) {
            this._onMessageSend(recipient, text)
        }
    }

    getNewMessages() {
        if (this._onNewMessageTrigger !== null && this._onNewMessageTrigger !== undefined) {
            this._onNewMessageTrigger()
        }
        if (this._onNewMessageTriggerChatUsers?.length > 0) {
            // this._onNewMessageTriggerChatUsers()
            this._onNewMessageTriggerChatUsers.map(item => {
                item()
            })
        }
        // this.checkNewMessagesNav()
    }

    checkNewMessagesNav(isUnseen) {
        if (this._onNewMessageNavTrigger !== null && this._onNewMessageNavTrigger !== undefined) {
            this._onNewMessageNavTrigger(isUnseen)
        }
    }

    checkDeletedMessages(messageId, userIdFrom) {
        if (this._onMessageDeletedTrigger !== null && this._onMessageDeletedTrigger !== undefined) {
            this._onMessageDeletedTrigger(messageId, userIdFrom)
        }
    }

    deleteMessage(recipient, messageId, userIdFrom) {
        if (this._onMessageDeleted !== null && this._onMessageDeleted !== undefined) {
            this._onMessageDeleted(recipient, messageId, userIdFrom)
        }
    }

    checkEditedMessages(messageId, userIdFrom, messageText) {
        if (this._onMessageEditedTrigger !== null && this._onMessageEditedTrigger !== undefined) {
            this._onMessageEditedTrigger(messageId, userIdFrom, messageText)
        }
    }

    editMessage(recipient, messageId, userIdFrom, messageText) {
        if (this._onMessageEdited !== null && this._onMessageEdited !== undefined) {
            this._onMessageEdited(recipient, messageId, userIdFrom, messageText)
        }
    }

}