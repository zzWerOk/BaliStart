import sideBarItem from '../classes/sideBarItem'
// import React from "react";
const moment = require('moment');

export const delay = ms => new Promise(res => setTimeout(res, ms))

export const epochToDate = epoch => {
    const date = new Date(epoch * 1);

    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
        month = "0" + month
    }
    if (day < 10) {
        day = "0" + day
    }

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
    if (month < 10) {
        month = "0" + month
    }
    if (day < 10) {
        day = "0" + day
    }
    if (hours < 10) {
        hours = "0" + hours
    }
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }

    return (day + "." + month + "." + year + " " + hours + ":" + minutes + ":" + seconds);
}

export const epochToDateWithTime = epoch => {

    if (epoch < 9999999999) {
        epoch = epoch * 1000
    } else {
        epoch = epoch * 1
    }

    const date = new Date(epoch);

    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (month < 10) {
        month = "0" + month
    }
    if (day < 10) {
        day = "0" + day
    }
    if (hours < 10) {
        hours = "0" + hours
    }
    if (minutes < 10) {
        minutes = "0" + minutes
    }

    return (day + "." + month + "." + year + " " + hours + ":" + minutes);
}

export const epochToDate_guide = epoch => {
    const m = moment(epoch * 1000);

    return m.format('DD-MM-yyyy')
}

export const epochToDate_userChatWithTime = epoch => {
    const m = moment(epoch * 1000);
    const currM = moment(Date.now());

    const year = m.format('yyyy')
    const month = m.format('MM')
    const monthT = m.format('MMM')
    const day = m.format('DD')
    const time = m.format('hh:mm')

    const currYear = currM.format('yyyy')
    const currMonth = currM.format('MM')
    const currDay = currM.format('DD')


    let userChatDate

    if(currDay === day && currMonth === month && currYear === year){
        userChatDate = time
    // }else if(currMonth === month && currYear === year){
    //     userChatDate = day + ' ' + time
    }else if(currYear === year){
        userChatDate = day + ' ' + monthT + ' ' + time
    }else{
        userChatDate = day + ' ' + monthT + ' ' + year + ' ' + time
    }

    // return m.format('DD-MM-yyyy hh:mm')
    return userChatDate
}

export const epochToDate_userChatTimeOnly = epoch => {
    const m = moment(epoch * 1000);

    return m.format('hh:mm')
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
export const GUIDES_ROUTE = '/guides'
export const TOURS_ROUTE = '/tours'
export const TOUR_ROUTE = '/tour/:id'
export const MAPPOINT_ROUTE = '/poi'
export const AUTH_ROUTE = '/auth'
export const TOPICS_ROUTE = '/topics'
export const TOPIC_ROUTE = '/topic/:id'
export const CREATE_TOPIC_ROUTE = '/newTopic'
export const EDIT_TOPIC_ROUTE = '/editTopic'

export const SIDEBAR_ISADMIN = [
    new sideBarItem('MAIN', MAIN_ROUTE),
    new sideBarItem('Admin', ADMIN_ROUTE),
    new sideBarItem('User', USER_ROUTE),
    new sideBarItem('Guide', GUIDE_ROUTE),
    new sideBarItem('Topics', TOPICS_ROUTE),
    new sideBarItem('Tours', TOURS_ROUTE),
    new sideBarItem('Map Point', MAPPOINT_ROUTE),
    // new sideBarItem('Login',AUTH_ROUTE),
]

export const SIDEBAR_ISAUTHUSER = [
    new sideBarItem('MAIN', MAIN_ROUTE),
    new sideBarItem('Tours', TOURS_ROUTE),
    new sideBarItem('Map Point', MAPPOINT_ROUTE),
]

export const SIDEBAR_NOTLOGGED = [
    new sideBarItem('Login', AUTH_ROUTE),
    new sideBarItem('Register', REGISTRATION_ROUTE)
]

export const getTourDuration = (duration) => {
    const durationArr = duration.split(' ')
    let durationIsDaysText = ''
    if (durationArr) {
        if (durationArr.length > 1) {
            if (durationArr[1] === 'd' || durationArr[1] === '2') {
                durationIsDaysText = ' day'
            } else {
                durationIsDaysText = ' hour'
            }
            if (durationArr[0] + '' !== '' + 1) {
                durationIsDaysText = durationIsDaysText + 's'
            }
            return durationArr[0] + durationIsDaysText
        }
    }
    return ''
}

export const getTourActivityLevel = (activityLevel) => {
    switch (activityLevel) {
        // case '1':
        // case 1:
        default:
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
    return langArr.map(item => {
        switch (item) {
            case 'ru':
                return langText + 'Russian '
            case 'id':
                return langText + 'Indonesian '
            default:
                return langText + 'English '
        }
    })
}

export const sortCategories = () => {
    let sortCodes = []

    sortCodes.push({name: 'Alphabetic', code: 'alpha', sort: 'up'})
    sortCodes.push({name: 'Alphabetic', code: 'realpha', sort: 'down'})
    sortCodes.push({name: 'Activity', code: 'date', sort: 'up'})
    sortCodes.push({name: 'Activity', code: 'redate', sort: 'down'})

    return sortCodes
}

export const sortTopics = () => {
    let sortCodes = []

    sortCodes.push({name: 'Alphabetic', code: 'alpha', sort: 'up'})
    sortCodes.push({name: 'Alphabetic', code: 'realpha', sort: 'down'})
    sortCodes.push({name: 'Date', code: 'date', sort: 'up'})
    sortCodes.push({name: 'Date', code: 'redate', sort: 'down'})

    return sortCodes
}

export const sortTours = () => {
    let sortCodes = []

    sortCodes.push({name: 'Alphabetic', code: 'alpha', sort: 'up'})
    sortCodes.push({name: 'Alphabetic', code: 'realpha', sort: 'down'})
    sortCodes.push({name: 'Date', code: 'date', sort: 'up'})
    sortCodes.push({name: 'Date', code: 'redate', sort: 'down'})

    return sortCodes
}

export const sortMapPoints = () => {
    let sortCodes = []

    sortCodes.push({name: 'Alphabetic', code: 'alpha', sort: 'up'})
    sortCodes.push({name: 'Alphabetic', code: 'realpha', sort: 'down'})
    // sortCodes.push({name: 'Date', code: 'date', sort: 'up'})
    // sortCodes.push({name: 'Date', code: 'redate', sort: 'down'})

    return sortCodes
}

export const getNewTopicElement = (type) => {

    switch (type) {
        case "text":
            return {"type": type, "name": "", "text": ""}
        case "comment":
            return {"type": type, "name": "", "text": ""}
        case "list":
            return {"type": type, "name": "", "items": '[]'}
        case "link":
            return {"type": type, "name": "", "items": '[{"type":"in","link":""}]'}
        case "email":
            return {"type": type, "name": "", "email": ""}
        case "phone":
            return {"type": type, "name": "", "items": '[{"type":"","phone":""}]'}
        case "images":
            return {"type": type, "name": "", "items": '[]'}
        case "googleMapUrl":
            return {"type": type, "name": "", "url": ""}
        case "line":
            return {"type": type, "style": "solid"}
        default:
            return null

    }

}

export const getNewTopicElementTitleByType = (type) => {
    for (let i = 0; i < addNewElementItems.length; i++) {
        if (addNewElementItems[i].type === type) {
            return addNewElementItems[i].name
        }
    }
}

export const addNewElementItems = [
    {
        id: 0,
        name: 'Text card',
        type: 'text',
    },
    {
        id: 1,
        name: 'Commend card',
        type: 'comment',
    },
    {
        id: 2,
        name: 'List card',
        type: 'list',
    },
    {
        id: 3,
        name: 'Link card',
        type: 'link',
    },
    {
        id: 4,
        name: 'Email card',
        type: 'email',
    },
    {
        id: 5,
        name: 'Phones card',
        type: 'phone',
    },
    {
        id: 6,
        name: 'Images card',
        type: 'images',
    },
    {
        id: 7,
        name: 'Google Map Url card',
        type: 'googleMapUrl',
    },
    {
        id: 8,
        name: 'Line',
        type: 'line',
    },
]

export const getNewTopicLinksTitleByType = (type) => {
    for (let i = 0; i < addNewLinksElement.length; i++) {
        if (addNewLinksElement[i].code === type) {
            return addNewLinksElement[i].name
        }

    }
}

export const addNewLinksElement = [
    {
        id: 0,
        name: 'Facebook',
        code: 'fb',
    },
    {
        id: 1,
        name: 'Google',
        code: 'gg',
    },
    {
        id: 2,
        name: 'VK',
        code: 'vk',
    },
    {
        id: 3,
        name: 'Telegram',
        code: 'tg',
    },
    {
        id: 4,
        name: 'Internet',
        code: 'in',
    },

]

export const getNewTopicPhonesTitleByType = (type) => {
    for (let i = 0; i < addNewPhonesElement.length; i++) {
        if (addNewPhonesElement[i].code === type) {
            return addNewPhonesElement[i].name
        }

    }
}

export const addNewPhonesElement = [
    {
        id: 0,
        name: 'WhatsApp',
        code: 'wa',
    },
    {
        id: 1,
        name: 'Viber',
        code: 'vb',
    },
    {
        id: 2,
        name: 'Telegram',
        code: 'tg',
    },
    {
        id: 3,
        name: 'Phone call + sms',
        code: 'ph',
    },
    {
        id: 4,
        name: 'Any',
        code: 'al',
    },
]

export const leftSideBarElements = [
    {
        id: 0,
        name: 'Main page',
        link: MAIN_ROUTE,
    },
    {
        id: 1,
        name: 'Topics page',
        link: TOPICS_ROUTE,
    },
    {
        id: 2,
        name: 'Categories page',
        link: CATEGORIES_ROUTE,
    },
    {
        id: 3,
        name: 'Tours',
        link: TOURS_ROUTE,
    },
    {
        id: 4,
        name: 'Points of interests',
        link: MAPPOINT_ROUTE,
    },
    {
        id: 5,
        name: 'Guides page',
        link: GUIDES_ROUTE,
    },
]
