import {$authHost, $host} from "./index";
import jwt_decode from 'jwt-decode'

const apiUrl = 'api/user'

export const getAll = async () => {
    const {data} = await $authHost.get(apiUrl+'/all')
    return data
}

export const getById = async (id) => {
    const {data} = await $authHost.get(apiUrl+'/' + id)
    return data
}

export const setIsActiveAPI = async (id, active) => {
    const {data} = await $authHost.post(apiUrl+'/active', {id, active})
    return data
}

export const setRoleAPI = async (id, role) => {
    const {data} = await $authHost.post(apiUrl+'/role', {id, role})
    return data
}

export const loginApi = async (email, password) => {
    const {data} = await $host.post(apiUrl+'/login', {email, password})

    if(!data.hasOwnProperty('error')) {
        try {
            localStorage.setItem('token', data)
            return jwt_decode(data)
        } catch (e) {
        }
    }
    return data
}

export const registerApi = async (name, email, password) => {
    const {data} = await $host.post(apiUrl+'/registration', {name, email, password})

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
    const {data} = await $authHost.get(apiUrl+'/auth')
    localStorage.setItem('token', data)
    return jwt_decode(data)
}
