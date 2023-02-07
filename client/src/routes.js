// import Admin from "./pages/Admin";
import {
    CATEGORY_ROUTE,
    MAIN_ROUTE, NOPAGE_ROUTE, TOPIC_ROUTE,
} from "./utils/consts";
// import Auth from "./pages/Auth";
// import GuidePage from "./pages/GuidePage";
// import Login from "./pages/Login";
import Main from "./pages/Main";
import Category from "./pages/Category";
import NoPage from "./pages/NoPage";
import Topic from "./pages/TopicDetails";
// import MapPointPage from "./pages/MapPointPage";
// import Registration from "./pages/Registration";
// import ToursPage from "./pages/ToursPage";
// import UserPage from "./pages/UserPage";
// import TopicsPage from "./pages/TopicsPage";

export const adminRoutes = [
    // {
    //     path: ADMIN_ROUTE,
    //     Component: Admin
    // },
    // {
    //     path: USER_ROUTE + '/:id',
    //     Component: UserPage
    // },
    // {
    //     path: GUIDE_ROUTE + '/:id',
    //     Component: GuidePage
    // },
    // {
    //     path: TOPICS_ROUTE,
    //     Component: TopicsPage
    // },
    {
        path: MAIN_ROUTE,
        Component: Main
    },

]

export const publicRoutes = [
    {
        path: MAIN_ROUTE,
        Component: Main
    },
    {
        path: CATEGORY_ROUTE,
        Component: Category
    },
    {
        path: NOPAGE_ROUTE,
        Component: NoPage
    },
    {
        path: TOPIC_ROUTE,
        Component: Topic
    },
    // {
    //     path: AUTH_ROUTE,
    //     Component: Auth
    // },
    // {
    //     path: REGISTRATION_ROUTE,
    //     Component: Registration
    // },
]

export const authUserRoutes = [
    {
        path: MAIN_ROUTE,
        Component: Main
    },
    // {
    //     path: AUTH_ROUTE,
    //     Component: Auth
    // },
    // {
    //     path: GUIDE_ROUTE,
    //     Component: GuidePage
    // },
    // {
    //     path: LOGIN_ROUTE,
    //     Component: Login
    // },
    // {
    //     path: MAPPOINT_ROUTE,
    //     Component: MapPointPage
    // },
    // {
    //     path: REGISTRATION_ROUTE,
    //     Component: Registration
    // },
    // {
    //     path: TOURS_ROUTE,
    //     Component: ToursPage
    // },
    // {
    //     path: USER_ROUTE,
    //     Component: UserPage
    // },

]