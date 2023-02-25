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

    if(epoch < 9999999999){
        epoch = epoch * 1000
    }else{
        epoch = epoch * 1
    }

    const date = new Date(epoch);

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


export const dateToEpoch = (date) => {
    return new Date(date).getTime() / 1000 || 0
}


export const ADMIN_ROUTE = '/admin'
export const USER_ROUTE = '/user'
export const LOGIN_ROUTE = '/login'
export const LOGOUT_ROUTE = '/logout'
export const REGISTRATION_ROUTE = '/registration'
export const MAIN_ROUTE = '/'
export const NOPAGE_ROUTE = '/404'
export const CATEGORY_ROUTE = '/category/:id'
export const CATEGORIES_ROUTE = '/categories'
export const GUIDE_ROUTE = '/guide'
export const TOURS_ROUTE = '/tours'
export const TOUR_ROUTE = '/tour/:id'
export const MAPPOINT_ROUTE = '/poi'
export const AUTH_ROUTE = '/auth'
export const TOPICS_ROUTE = '/topics'
export const TOPIC_ROUTE = '/topic/:id'

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

export const getTourDuration = (duration) => {
    const durationArr = duration.split(' ')
    let durationIsDaysText = ''
    if (durationArr) {
        if (durationArr.length > 1) {
            if (durationArr[1] === 'd' || durationArr[1] === '2') {
                durationIsDaysText = ' day'
            }else{
                durationIsDaysText = ' hour'
            }
            if(durationArr[0] + '' !== '' + 1) {
                durationIsDaysText = durationIsDaysText + 's'
            }
            return durationArr[0] + durationIsDaysText
        }
    }
    return ''
}

export const getTourActivityLevel = (activityLevel) => {
    switch (activityLevel) {
        case '1':
        case 1:
            return 'Easy level'
        case '2':
        case 2:
            return 'Normal level'
        case '3':
        case 3:
            return 'Medium level'
        case '4':
        case 4:
            return 'Hard level'
        case '5':
        case 5:
            return 'Expert level'
    }
}

export const tourLanguages = (lang) => {
    const langArr = JSON.parse(lang)
    let langText = ''
    langArr.map(item => {

        switch (item) {
            case 'ru':
                langText = langText + 'Russian '
                break
            case 'en':
                langText = langText + 'English '
                break
            case 'id':
                langText = langText + 'Indonesian '
                break
        }
    })

    return langText
}

// module.exports = {
//     tourLanguages,
//     getTourActivityLevel,
//     getTourDuration,
// }