import {$authHost, $host} from "./index";
import jwt_decode from 'jwt-decode'

export const getById = async (id) => {
    const {data} = await $authHost.get('api/user/' + id)
    return data
}
