// import Admin from "./pages/Admin";
import {
    CATEGORIES_ROUTE,
    CATEGORY_ROUTE,
    MAIN_ROUTE, NOPAGE_ROUTE, TOPIC_ROUTE, TOPICS_ROUTE, TOUR_ROUTE, TOURS_ROUTE,
} from "./utils/consts";
// import Auth from "./pages/Auth";
// import GuidePage from "./pages/GuidePage";
// import Login from "./pages/Login";
import Main from "./pages/Main";
import Category from "./pages/Category";
import NoPage from "./pages/NoPage";
import Topic from "./pages/TopicDetails";
import TopicsPage from "./pages/TopicsPage";
import Categories from "./pages/Categories";
import ToursPage from "./pages/ToursPage";
import TourDetails from "./pages/TourDetails";
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
        path: CATEGORIES_ROUTE,
        Component: Categories
    },
    {
        path: NOPAGE_ROUTE,
        Component: NoPage
    },
    {
        path: TOPIC_ROUTE,
        Component: Topic
    },
    {
        path: TOPICS_ROUTE,
        Component: TopicsPage
    },
    {
        path: TOURS_ROUTE,
        Component: ToursPage
    },
    {
        path: TOUR_ROUTE,
        Component: TourDetails
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