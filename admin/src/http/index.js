import axios from "axios";

const $host = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
    // headers: {'Content-Type': 'multipart/form-data'},
    headers: {
        // 'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
    // headers: {
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    //     "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length"
    // }
})

const $authHost = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
    // headers: {'Content-Type': 'multipart/form-data'}
    // headers: {'Content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*'},
    headers: {
        // 'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
    // headers: {
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    //     "Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length"
    // }

})

const $authHostUpload = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
    headers: {'Content-Type': 'multipart/form-data'}

})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

// const fileInterceptor = config => {
//     config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
//     config.headers['Content-Type'] = 'multipart/form-data'
//     return config
// }

$authHost.interceptors.request.use(authInterceptor)
$authHostUpload.interceptors.request.use(authInterceptor)

export {
    $host,
    $authHost,
    $authHostUpload
}