import {$authHost} from "./index";

const apiUrl = 'api/message'

export const createMessage = async (userIdTo, message) => {

    const {data} = await $authHost.post(apiUrl + '/create', {userIdTo, message})
    return data
}

export const getChatUsers = async () => {
    const {data} = await $authHost.get(apiUrl + '/getChatUsers')
    return data
}

export const getMessages = async (chatUserId) => {
    const {data} = await $authHost.get(apiUrl + '/' + chatUserId)
    return data
}

