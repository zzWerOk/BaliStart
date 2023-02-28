import {$authHost} from "./index";


export const createAPI = async (name, description) => {
    const {data} = await $authHost.post('api/topicscategory/create', {category_name: name, description})
    return data
}

export const changeAPI = async (id, name, description, is_for_tour=false) => {
    const {data} = await $authHost.post('api/topicscategory/change', {category_name: name, description, is_for_tour, id})
    return data
}

export const setIsActiveAPI = async (id, active) => {
    const {data} = await $authHost.post('api/topicscategory/active', {id, active})
    return data
}

export const getAll = async () => {
    const {data} = await $authHost.get('api/topicscategory/allAdmin')
    return data
}

export const getById = async (id) => {
    const {data} = await $authHost.get('api/topicscategory/' + id)
    return data
}

export const deleteAPI = async (id) => {

    const {data} = await $authHost.delete('api/topicscategory',{ params: { id: id } })
    return data
}
