import sideBarItem from '../classes/sideBarItem'

export const delay = ms => new Promise(res => setTimeout(res, ms))

export const epochToDate = epoch => {
    const date = new Date(epoch * 1);

    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if(month < 10){month = "0" + month}
    if(day < 10){day = "0" + day}

    return (day + "." + month + "." + year);
}

export const epochToDateWithTime_seconds = epoch => {
    const date = new Date(epoch * 1);

    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    if(month < 10){month = "0" + month}
    if(day < 10){day = "0" + day}
    if(hours < 10){hours = "0" + hours}
    if(minutes < 10){minutes = "0" + minutes}
    if(seconds < 10){seconds = "0" + seconds}

    return (day + "." + month + "." + year + " " + hours + ":" + minutes + ":" + seconds);
}

export const epochToDateWithTime = epoch => {
    const date = new Date(epoch * 1);

    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if(month < 10){month = "0" + month}
    if(day < 10){day = "0" + day}
    if(hours < 10){hours = "0" + hours}
    if(minutes < 10){minutes = "0" + minutes}

    return (day + "." + month + "." + year + " " + hours + ":" + minutes);
}

export const dateToEpoch = date => {
    return new Date(date).getTime() / 1000
}


export const ADMIN_ROUTE = '/admin'
export const USER_ROUTE = '/user'
export const LOGIN_ROUTE = '/login'
export const LOGOUT_ROUTE = '/logout'
export const REGISTRATION_ROUTE = '/registration'
export const MAIN_ROUTE = '/'
export const GUIDE_ROUTE = '/guide'
export const TOURS_ROUTE = '/tours'
export const MAPPOINT_ROUTE = '/mappoint'
export const AUTH_ROUTE = '/auth'
export const TOPICS_ROUTE = '/topics'

export const SIDEBAR_ISADMIN = [
    new sideBarItem('MAIN',MAIN_ROUTE),
    new sideBarItem('Admin',ADMIN_ROUTE),
    new sideBarItem('User',USER_ROUTE),
    new sideBarItem('Guide',GUIDE_ROUTE),
    new sideBarItem('Topics',TOPICS_ROUTE),
    new sideBarItem('Tours',TOURS_ROUTE),
    new sideBarItem('Map Point',MAPPOINT_ROUTE),
    // new sideBarItem('Login',AUTH_ROUTE),
]

export const SIDEBAR_ISAUTHUSER = [
    new sideBarItem('MAIN',MAIN_ROUTE),
    new sideBarItem('Tours',TOURS_ROUTE),
    new sideBarItem('Map Point',MAPPOINT_ROUTE),
]

export const SIDEBAR_NOTLOGGED = [
    new sideBarItem('Login',AUTH_ROUTE),
    new sideBarItem('Register',REGISTRATION_ROUTE)
]

