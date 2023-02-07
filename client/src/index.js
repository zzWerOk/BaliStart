import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import UserStore from "./store/UserStore";
import TopicsCategoryStore from "./store/TopicsCategoryStore";
import ScrollMemory from "react-router-scroll-memory";

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore(),
        topicsCategoryStore: new TopicsCategoryStore(),
    }}>
        <BrowserRouter>
            <ScrollMemory/>
            <App/>
        </BrowserRouter>
    </Context.Provider>
);

