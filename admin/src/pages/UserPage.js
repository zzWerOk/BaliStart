import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import UserPageCard from "../components/users/UserPageCard";
import {delay, MAIN_ROUTE} from "../utils/consts";
import {getAll} from "../http/userAPI";
import {getTableUpdateByName} from "../http/tableUpdatesAPI"
import SpinnerSM from "../components/SpinnerSM";
import UserListCell from "../components/users/UserListCell";
import UserList from "../components/users/UserList";

const UserPage = () => {
    const {navBarTitle} = useContext(Context)
    const {userList} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        navBarTitle.navBarTitle = 'User Page'
    }, [])

    useEffect(() => {
        delay(0).then(r => {

            getTableUpdateByName('User').then(tuData => {
                const lastDateTable = userList.getSavedLastDateTableUser()

                if (tuData.date !== lastDateTable) {
                    getAll().then(data => {
                        /**
                         Сохраняем список пользователей преобразовав его в строку
                         **/
                        // console.log('Даты не равны, получаем данные с сервера')
                        userList.saveUserList(data.rows)
                    }).finally(() => {
                    })
                    /**
                     Сохраняем дату последнего изменения таблицы
                     **/
                    userList.saveLastDateTableUser(tuData.date)

                // }else {
                    // console.log('Даты равны, получаем данные с LocalStorage')
                }

            }).finally(() => {
                setLoading(false)
            })

        })
    }, [])

    if (loading) {
        return <SpinnerSM/>
    } else {

        return (
            <div>
                <UserList/>
            </div>
        )
    }

};

export default UserPage;