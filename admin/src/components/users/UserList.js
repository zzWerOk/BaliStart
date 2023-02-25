import React, {useContext, useState} from 'react';
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import UserDetailsCard from "./components/UserDetailsCard";
import UserEditCard from "./components/UserEditCard";

const UserList = observer(() => {
    const {userList} = useContext(Context)

    const [userClicked, setUserClicked] = useState(-1)
    const [selectedUser, setSelectedUser] = useState(null)
    const [selectedUserEdited, setSelectedUserEdited] = useState(false)

    const [redraw, setRedraw] = useState(false)

    if (userList.getSavedUserList === null) {
        return (
            <div>
                Нет данных для отображения
            </div>
        );
    }

    const clickUser = (userId) => {
        if (userId === userClicked) {
            setUserClicked(-1)
            setSelectedUser(null)
            setSelectedUserEdited(false)
        } else {
            setUserClicked(userId)

            const usersArr = userList.getSavedUserList
            for (let i = 0; i < usersArr.length; i++) {
                const currUser = usersArr[i]
                if (userId === currUser.id) {
                    setSelectedUser(JSON.parse(JSON.stringify(currUser)))
                    break
                }
            }
        }
    }

    const setUserSaved = (value) => {
        setSelectedUser(JSON.parse(JSON.stringify(value)))
        setRedraw(!redraw)
    }

    const setUserEdited = (value) => {
        setSelectedUserEdited(value)
    }

    return (

        <div className="container py-5">
            <div className="text-center row justify-content-center">

                {
                    !selectedUser
                        ?
                        userList.getSavedUserList.map(function (currUser) {
                            return <UserDetailsCard
                                clickUser={clickUser}
                                userClicked={userClicked}
                                key={currUser.email}
                                currUser={currUser}
                            />
                        })
                        :
                        <>
                            <UserDetailsCard
                                clickUser={clickUser}
                                userClicked={userClicked}
                                currUser={selectedUser}
                                key={redraw}
                                selectedUserEdited={selectedUserEdited}
                            />
                            <UserEditCard
                                userClicked={userClicked}
                                setUserEdited={setUserEdited}
                                setUserSaved={setUserSaved}
                                clickUser={clickUser}
                            />
                        </>
                }

            </div>
        </div>

    );
});

export default UserList;