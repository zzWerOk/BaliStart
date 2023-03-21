import {$authHost} from "./index";

const apiUrl = 'api/message'

export const createMessage = async (userIdTo, message, editedMessageId = -1) => {
    const {data} = await $authHost.post(apiUrl + '/create', {userIdTo, message, editedMessageId})
    return data
}

export const deleteMessage = async (messageId = -1) => {
    // const {data} = await $authHost.post(apiUrl + '/messagedelete', {messageId})
    // const {data} = await $authHost.delete(apiUrl+'/' + messageId)

    const {data} = await $authHost.delete(apiUrl + '/', {params: {messageId}})
    return data
}

export const getChatUsers = async () => {
    const {data} = await $authHost.get(apiUrl + '/getChatUsers')
    return data
}

export const getMessages = async (chatUserId, countBefore) => {
    const {data} = await $authHost.get(apiUrl + '/', {params: {countBefore, chatUserId}})
    return data
}

export const getMessagesNew = async (dateBefore, chatUserId) => {
    const {data} = await $authHost.get(apiUrl + '/getMessagesNew', {params: {dateBefore, chatUserId}})
    return data
}

export const setMessagesSeen = async (messagesIds) => {
    const {data} = await $authHost.post(apiUrl + '/setMessagesSeen', {messagesIds})
    return data
}

export const checkMessagesNew = async () => {
    const {data} = await $authHost.get(apiUrl + '/checkMessagesNew')
    return data
}

