import {makeAutoObservable} from "mobx";

export default class MessagesStore {

    constructor() {
        this._onMessageSend = null
        this._onNewMessageTrigger = null
        this._onNewMessageNavTrigger = null
        // this._onNewMessageTriggerChatUsers = null
        this._onNewMessageTriggerChatUsers = []


        makeAutoObservable(this)
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

}