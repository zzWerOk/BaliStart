import axios from "axios";

const $host = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

const $authHost = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

const $authHostUpload = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
    headers: {'Content-Type': 'multipart/form-data'}
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

$authHost.interceptors.request.use(authInterceptor)
$authHostUpload.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost,
    $authHostUpload
}