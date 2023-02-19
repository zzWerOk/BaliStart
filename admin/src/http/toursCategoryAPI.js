import {$authHost} from "./index";

const apiUrl = 'api/tourscategory'

export const createAPI_Cat = async (name, description) => {
    const {data} = await $authHost.post(apiUrl+'/create', {category_name: name, description})
    return data
}

export const changeAPI_Cat = async (id, name, description, is_for_tour=false) => {
    const {data} = await $authHost.post(apiUrl+'/change', {category_name: name, description, id})
    return data
}

export const setIsActiveAPI = async (id, active) => {
    const {data} = await $authHost.post(apiUrl+'/active', {id, active})
    return data
}

export const getAll_Cat = async () => {
    const {data} = await $authHost.get(apiUrl+'/allAdmin')
    return data
}

export const getById = async (id) => {
    const {data} = await $authHost.get(apiUrl+'/' + id)
    return data
}

export const deleteAPI_Cat = async (id) => {

    const {data} = await $authHost.delete(apiUrl+'',{ params: { id: id } })
    return data
}
