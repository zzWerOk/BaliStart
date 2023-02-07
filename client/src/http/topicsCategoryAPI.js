import {$authHost, $host} from "./index";

const apiUrl = 'api/topicscategory'

export const createAPI = async (name, description) => {
    const {data} = await $authHost.post(apiUrl+'/create', {category_name: name, description})
    return data
}

export const changeAPI = async (id, name, description, is_for_tour=false) => {
    const {data} = await $authHost.post(apiUrl+'/change', {category_name: name, description, is_for_tour, id})
    return data
}

export const setIsActiveAPI = async (id, active) => {
    const {data} = await $authHost.post(apiUrl+'/active', {id, active})
    return data
}

export const getAll = async (isSortASC) => {
    const sort = isSortASC ? 'ASC' : 'DESC'
    const {data} = await $authHost.get(apiUrl+'/all',{ params: { sort } })
    return data
}

export const getById = async (id) => {
    const {data} = await $authHost.get(apiUrl+'/' + id)
    return data
}

export const deleteAPI = async (id) => {

    const {data} = await $authHost.delete(apiUrl+'',{ params: { id: id } })
    return data
}
