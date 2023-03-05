import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import UserStore from "./store/UserStore";
import TopicsCategoryStore from "./store/TopicsCategoryStore";
import TopicCommentsStore from "./store/TopicCommentsStore";
import ToursCategoryStore from "./store/ToursCategoryStore";
import ToursTypeStore from "./store/ToursTypeStore";
import RightSideBarStore from "./store/RightSideBarStore";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore(),
        topicsCategoryStore: new TopicsCategoryStore(),
        topicCommentsStore: new TopicCommentsStore(),
        toursCategoryStore: new ToursCategoryStore(),
        toursTypeStore: new ToursTypeStore(),
        rightSideBarStore: new RightSideBarStore(),
    }}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Context.Provider>
);

