import {$authHost, $authHostUpload, $host} from "./index";
import jwt_decode from 'jwt-decode'

export const register = async (name, email, password) => {
    const {data} = await $host.post('api/user/registration', {name, email, password})

    if (!data.hasOwnProperty('error')) {
        try {
            localStorage.setItem('token', data)
            return jwt_decode(data)
        } catch (e) {
        }
    }
    return data
}

export const getAll = async () => {
    const {data} = await $authHost.get('api/user/all')
    return data
}

export const getUserById = async (id) => {
    const {data} = await $authHost.get('api/user/' + id)
    return data
}

export const setIsActiveAPI = async (id, active) => {
    const {data} = await $authHost.post('api/user/active', {id, active})
    return data
}

export const saveUserData = async (id,
                                  name,
                                  email,
                                  is_active,
                                  is_admin,
                                  is_guide,
                                  avatar_img,
) => {
    let formData = new FormData();
    formData = addToFormData(formData,
        id,
        name,
        email,
        is_active,
        is_admin,
        is_guide,
        avatar_img,
    )

    if (!formData) {
        console.log('FormData error...')
        return null
    }

    const {data} = await $authHostUpload.post('api/user/changeAdmin', formData)
    return data
}

const addToFormData = (formData,
                       id,
                       name,
                       email,
                       is_active,
                       is_admin,
                       is_guide,
                       avatar_img,
) => {
    try {
        formData.append("id", id);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("is_active", is_active);
        formData.append("is_admin", is_admin);
        formData.append("is_guide", is_guide);

        if (avatar_img !== '') {
            if (avatar_img !== undefined) {
                try {
                    formData.append("img", avatar_img, "imageFile");
                } catch (e) {
                    console.log('File apply error: ', e.message)
                }
            }
        }

        return formData
    } catch (e) {
        return null
    }
}

export const setRoleAPI = async (id, role) => {
    const {data} = await $authHost.post('api/user/role', {id, role})
    return data
}


export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})

    if (!data.hasOwnProperty('error')) {
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

