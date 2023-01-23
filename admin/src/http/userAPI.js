import {$authHost, $host} from "./index";
import jwt_decode from 'jwt-decode'

export const getAll = async () => {
    const {data} = await $authHost.get('api/user/all')
    return data
}

export const getById = async (id) => {
    const {data} = await $authHost.get('api/user/' + id)
    return data
}

export const setIsActiveAPI = async (id, active) => {
    const {data} = await $authHost.post('api/user/active', {id, active})
    return data
}

export const setRoleAPI = async (id, role) => {
    const {data} = await $authHost.post('api/user/role', {id, role})
    return data
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})

    if(!data.hasOwnProperty('error')) {
        try {
            localStorage.setItem('token', data)
            return jwt_decode(data)
        } catch (e) {
        }
    }
    return data
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth')
    localStorage.setItem('token', data)
    return jwt_decode(data)
}
