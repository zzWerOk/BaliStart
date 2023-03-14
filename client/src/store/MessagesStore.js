import {makeAutoObservable} from "mobx";

export default class MessagesStore {

    constructor() {
        this._onMessageSend = null
        this._onNewMessageTrigger = null
        this._onNewMessageTriggerChatUsers = null


        makeAutoObservable(this)
    }


    set onNewMessageTriggerChatUsers(value) {
        this._onNewMessageTriggerChatUsers = value;
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

    getNewMessages(){
        if (this._onNewMessageTrigger !== null && this._onNewMessageTrigger !== undefined) {
            this._onNewMessageTrigger()
        }
        if (this._onNewMessageTriggerChatUsers !== null && this._onNewMessageTriggerChatUsers !== undefined) {
            this._onNewMessageTriggerChatUsers()
        }
    }

}