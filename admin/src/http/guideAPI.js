import {$authHost} from "./index";

export const getById = async (id) => {
    const {data} = await $authHost.get('api/user/' + id)
    return data
}

export const getAllGuides = async () => {
    const {data} = await $authHost.get('api/user/allGuides')
    return data
}

