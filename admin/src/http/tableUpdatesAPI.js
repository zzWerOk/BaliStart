import {$authHost, $host} from "./index";


export const create = async () => {
    const {data} = await $authHost.post('api/tableupdates/create')
    return data
}

export const change = async () => {
    const {data} = await $authHost.post('api/tableupdates/change')
    return data
}

export const setIsActiveAPI = async (id, active) => {
    const {data} = await $authHost.post('api/tableupdates/active', {id, active})
    return data
}

export const getAll = async () => {
    const {data} = await $authHost.get('api/tableupdates/all')
    return data
}

export const getById = async (id) => {
    const {data} = await $authHost.get('api/tableupdates/' + id)
    return data
}

export const getTableUpdateByName = async (name) => {
    const {data} = await $authHost.get('api/tableupdates/getbyname',{ params: { table_name: name } })
    return data
}
