import React, {useContext, useState} from 'react';
import UserListCell from "./UserListCell";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";


const UserList = observer( () => {
    const {userList} = useContext(Context)

    if(userList.getSavedUserList === null){
        return (
            <div>
                Нет данных для отображения
            </div>
        );
    }

    return (
        <div>
            {userList.getSavedUserList.map( currUser =>
                <UserListCell key={currUser.email} currUser={currUser}/>
            )}
        </div>
    );
});

export default UserList;