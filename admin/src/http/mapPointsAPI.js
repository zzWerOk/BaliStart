import {$authHost, $authHostUpload, $host} from "./index";

export const getAll = async () => {

    const {data} = await $host.get('api/mappoint/all')
    return data
}

export const getMapPointData = async (id) => {
    const {data} = await $host.get('api/mappoint/data/' + id)
    return data
}

