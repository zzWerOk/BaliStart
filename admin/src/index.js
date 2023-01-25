import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import UserStore from "./store/UserStore";
import TopicsCategoryStore from "./store/TopicsCategoryStore";
import ToursCategoryStore from "./store/ToursCategoryStore";
import TopicsStore from "./store/TopicsStore";
import ToursStore from "./store/ToursStore";
import TopicDetailsStore from "./store/TopicDetailsStore";
import UserListStore from "./store/UserListStore";
import NavBarStore from "./store/NavBarStore";
import {BrowserRouter} from "react-router-dom";
import MapPointsStore from "./store/MapPointsStore";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore(),
        userList: new UserListStore(),
        topicsCategoryStore: new TopicsCategoryStore(),
        toursCategoryStore: new ToursCategoryStore(),
        toursStore: new ToursStore(),
        topicsStore: new TopicsStore(),
        mapPointsStore: new MapPointsStore(),
        topicDetailsStore: new TopicDetailsStore(),
        navBarTitle: new NavBarStore()
    }}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Context.Provider>
);
