const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    avatar_img: {type: DataTypes.STRING},
    is_active: {type: DataTypes.BOOLEAN, defaultValue: true},
    is_admin: {type: DataTypes.BOOLEAN, defaultValue: false},
    is_guide: {type: DataTypes.BOOLEAN, defaultValue: false},
    is_agent: {type: DataTypes.BOOLEAN, defaultValue: false},
    date_last_login: {type: DataTypes.BIGINT}
})

const Guide = sequelize.define('guide', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.INTEGER, allowNull: false},
    avatar_img: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    about: {type: DataTypes.STRING},
    religion: {type: DataTypes.STRING},
    experience: {type: DataTypes.INTEGER},
    active_till: {type: DataTypes.BIGINT, defaultValue:0 ,allowNull: false},
    visible_till: {type: DataTypes.BIGINT, defaultValue:0 ,allowNull: false},
    phones: {type: DataTypes.STRING},
    links: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    is_has_car: {type: DataTypes.BOOLEAN},
    languages: {type: DataTypes.STRING, allowNull: false},
    tours_ids: {type: DataTypes.INTEGER},
    is_emergency_help: {type: DataTypes.BOOLEAN},
    emergency_help_price: {type: DataTypes.STRING},
    is_can_discount: {type: DataTypes.BOOLEAN},
    holidays: {type: DataTypes.INTEGER}
})

const Agent = sequelize.define('agent', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.INTEGER, allowNull: false},
    avatar_img: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    about: {type: DataTypes.STRING},
    active_till: {type: DataTypes.BIGINT, defaultValue:0 ,allowNull: false},
    visible_till: {type: DataTypes.BIGINT, defaultValue:0 ,allowNull: false},
    phones: {type: DataTypes.STRING},
    links: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    languages: {type: DataTypes.STRING, allowNull: false},
})

const Tours = sequelize.define('tours', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING},
    image_logo: {type: DataTypes.STRING, allowNull: false},
    created_by_user_id: {type: DataTypes.INTEGER},
    created_date: {type: DataTypes.BIGINT},
    active: {type: DataTypes.BOOLEAN, defaultValue: true},
    tour_category: {type: DataTypes.STRING},
    tour_type: {type: DataTypes.STRING},
    duration: {type: DataTypes.STRING},
    activity_level: {type: DataTypes.STRING},
    languages: {type: DataTypes.STRING},
    map_points: {type: DataTypes.STRING},
    file_name: {type: DataTypes.STRING},
    guide_can_add: {type: DataTypes.BOOLEAN, defaultValue: true},
    selected_guides: {type: DataTypes.STRING},
    price_usd: {type: DataTypes.INTEGER, defaultValue: 0},

})

const MapPoint = sequelize.define('map_point', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING},
    topics: {type: DataTypes.STRING},
    image_logo: {type: DataTypes.STRING, allowNull: false},
    google_map_url: {type: DataTypes.STRING},
    active: {type: DataTypes.BOOLEAN, defaultValue: true},
    created_by_user_id: {type: DataTypes.INTEGER},
    created_date: {type: DataTypes.BIGINT},
    file_name: {type: DataTypes.STRING},

})

const Topics = sequelize.define('topics', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING},
    tag: {type: DataTypes.STRING},
    image_logo: {type: DataTypes.STRING, allowNull: false},
    images: {type: DataTypes.STRING},
    videos: {type: DataTypes.STRING},
    google_map_url: {type: DataTypes.STRING},
    active: {type: DataTypes.BOOLEAN, defaultValue: true},
    created_by_user_id: {type: DataTypes.INTEGER},
    created_date: {type: DataTypes.BIGINT},
    deleted_by_user_id: {type: DataTypes.INTEGER},
    deleted_date: {type: DataTypes.BIGINT},
    file_name: {type: DataTypes.STRING},
})

const TopicComments = sequelize.define('topic_comments', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    text: {type: DataTypes.STRING},
    topic_id: {type: DataTypes.INTEGER},
    topic_comment_id: {type: DataTypes.INTEGER},
    created_by_user_id: {type: DataTypes.INTEGER},
    created_date: {type: DataTypes.BIGINT},
    file_name: {type: DataTypes.STRING},
    reply_ids: {type: DataTypes.STRING},
    on_topic_comment_reply_id: {type: DataTypes.INTEGER},
    is_reply: {type: DataTypes.BOOLEAN, defaultValue: false},
})

const TopicsCategory = sequelize.define('topics_category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    category_name: {type: DataTypes.STRING, allowNull: false, unique: true},
    description: {type: DataTypes.STRING},
    is_active: {type: DataTypes.BOOLEAN, defaultValue: true},
    is_for_tour: {type: DataTypes.BOOLEAN, defaultValue: false},
    topics_count: {type: DataTypes.INTEGER},
})

const ToursCategory = sequelize.define('tours_category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    category_name: {type: DataTypes.STRING, allowNull: false, unique: true},
    description: {type: DataTypes.STRING},
    is_active: {type: DataTypes.BOOLEAN, defaultValue: true},

})

const ToursType = sequelize.define('tours_types', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type_name: {type: DataTypes.STRING, allowNull: false, unique: true},
    description: {type: DataTypes.STRING},
    is_active: {type: DataTypes.BOOLEAN, defaultValue: true},

})

const TableUpdates = sequelize.define('table_updates', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    table_name: {type: DataTypes.STRING, allowNull: false, unique: true},
    date: {type: DataTypes.BIGINT}
})

const Files = sequelize.define('files', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    table_name: {type: DataTypes.STRING, allowNull: false},
    file_name: {type: DataTypes.STRING, allowNull: false, unique: true},
    md5: {type: DataTypes.STRING, allowNull: false},
})

User.hasOne(Guide)
Guide.belongsTo(User)

User.hasOne(Topics)
Topics.belongsTo(User)

module.exports = {
    User,
    Guide,
    Agent,
    Tours,
    MapPoint,
    Topics,
    TableUpdates,
    Files,
    TopicsCategory,
    ToursCategory,
    ToursType,
    TopicComments,
}