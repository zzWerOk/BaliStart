import {$host} from "./index";

const apiUrl = 'api/tourstype'

export const getAllTours_Type = async () => {
    const {data} = await $host.get(apiUrl+'/all')
    return data
}

export const getTours_TypeById = async (id) => {
    const {data} = await $host.get(apiUrl+'/' + id)
    return data
}
