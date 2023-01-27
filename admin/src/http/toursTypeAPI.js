import {$authHost, $host} from "./index";

const apiUrl = 'api/tourstype'

export const createAPI_Type = async (name, description) => {
    const {data} = await $authHost.post(apiUrl+'/create', {type_name: name, description})
    return data
}

export const changeAPI_Type = async (id, name, description, is_for_tour=false) => {
    const {data} = await $authHost.post(apiUrl+'/change', {type_name: name, description, id})
    return data
}

export const setIsActiveAPI = async (id, active) => {
    const {data} = await $authHost.post(apiUrl+'/active', {id, active})
    return data
}

export const getAll_Type = async () => {
    const {data} = await $authHost.get(apiUrl+'/all')

    if(data.hasOwnProperty('rows')) {
        let newRows = []
        data.rows.map(currRow => {
            let newRow = {}
            newRow.createdAt = currRow.createdAt
            newRow.description = currRow.description
            newRow.id = currRow.id
            newRow.is_active = currRow.is_active
            newRow.category_name = currRow.type_name
            newRow.updatedAt = currRow.updatedAt

            newRows.push(newRow)
        })
        return {count: data.count, rows: newRows}
    }
    return data
}

export const getById = async (id) => {
    const {data} = await $authHost.get(apiUrl+'/' + id)
    return data
}

export const deleteAPI_Type = async (id) => {
    const {data} = await $authHost.delete(apiUrl+'',{ params: { id: id } })
    return data
}
