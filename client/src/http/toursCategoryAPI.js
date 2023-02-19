import {$host} from "./index";

const apiUrl = 'api/tourscategory'

export const getAll_ToursCat = async () => {
    const {data} = await $host.get(apiUrl+'/all')
    return data
}

export const getToursCatById = async (id) => {
    const {data} = await $host.get(apiUrl+'/' + id)
    return data
}
