import {$authHost, $host} from "./index";

const apiUrl = 'api/tableupdates'

export const create = async () => {
    const {data} = await $authHost.post(apiUrl+'/create')
    return data
}

export const change = async () => {
    const {data} = await $authHost.post(apiUrl+'/change')
    return data
}

export const setIsActiveAPI = async (id, active) => {
    const {data} = await $authHost.post(apiUrl+'/active', {id, active})
    return data
}

export const getAll = async () => {
    const {data} = await $authHost.get(apiUrl+'/all')
    return data
}

export const getById = async (id) => {
    const {data} = await $authHost.get(apiUrl+'/' + id)
    return data
}

export const getTableUpdateByName = async (name) => {
    const {data} = await $authHost.get(apiUrl+'/getbyname',{ params: { table_name: name } })
    return data
}
