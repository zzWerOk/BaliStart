import {
    CATEGORIES_ROUTE,
    CATEGORY_ROUTE,
    MAIN_ROUTE,
    NOPAGE_ROUTE,
    TOPIC_ROUTE,
    TOPICS_ROUTE,
    TOUR_ROUTE,
    TOURS_ROUTE,
    MAPPOINT_ROUTE,
    CREATE_TOPIC_ROUTE, EDIT_TOPIC_ROUTE, USER_ROUTE, MESSAGES_ROUTE, ADS_ROUTE,
} from "./utils/consts";
import Main from "./pages/Main";
import Category from "./pages/Category";
import NoPage from "./pages/NoPage";
import Topic from "./pages/TopicDetails";
import TopicsPage from "./pages/TopicsPage";
import Categories from "./pages/Categories";
import ToursPage from "./pages/ToursPage";
import TourDetails from "./pages/TourDetails";
import MapPointsPage from "./pages/MapPointsPage";
import CreateTopicPage from "./pages/CreateTopicPage";
import UserProfile from "./pages/UserProfile";
import MessagesPage from "./pages/MessagesPage";
import AdsPage from "./pages/Ads";

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
    {
        path: MAPPOINT_ROUTE,
        Component: MapPointsPage
    },
    {
        path: CREATE_TOPIC_ROUTE,
        Component: CreateTopicPage
    },
    {
        path: EDIT_TOPIC_ROUTE,
        Component: CreateTopicPage
    },
    {
        path: USER_ROUTE,
        Component: UserProfile
    },
    {
        path: MESSAGES_ROUTE,
        Component: MessagesPage
    },
    {
        path: ADS_ROUTE,
        Component: AdsPage
    },
]
