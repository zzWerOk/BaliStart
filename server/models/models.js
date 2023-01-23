const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    is_active: {type: DataTypes.BOOLEAN, defaultValue: true},
    is_admin: {type: DataTypes.BOOLEAN, defaultValue: false},
    is_guide: {type: DataTypes.BOOLEAN, defaultValue: false},
    date_last_login: {type: DataTypes.BIGINT}
})

const Guide = sequelize.define('guide', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.INTEGER, allowNull: false},
    avatar_img: {type: DataTypes.STRING, allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    active_till: {type: DataTypes.BIGINT, defaultValue:0 ,allowNull: false},
    visible_till: {type: DataTypes.BIGINT, defaultValue:0 ,allowNull: false},
    phone: {type: DataTypes.STRING, allowNull: false},
    is_has_car: {type: DataTypes.BOOLEAN},
    languages: {type: DataTypes.STRING, allowNull: false},
    tours_ids: {type: DataTypes.ARRAY(DataTypes.INTEGER)},
    is_emergency_help: {type: DataTypes.BOOLEAN},
    emergency_help_price: {type: DataTypes.STRING},
    is_can_discount: {type: DataTypes.BOOLEAN},
    holidays: {type: DataTypes.ARRAY(DataTypes.INTEGER)}
})

const Tours = sequelize.define('tours', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING},
    image_logo: {type: DataTypes.STRING, allowNull: false},
    images: {type: DataTypes.ARRAY(DataTypes.STRING)},
    videos: {type: DataTypes.ARRAY(DataTypes.STRING)},
    tracks: {type: DataTypes.ARRAY(DataTypes.STRING)},
    deleted: {type: DataTypes.BOOLEAN, defaultValue: false},
    created_by_user_id: {type: DataTypes.INTEGER},
    created_date: {type: DataTypes.BIGINT},
    deleted_by_user_id: {type: DataTypes.INTEGER},
    deleted_date: {type: DataTypes.BIGINT}
})

const MapPoint = sequelize.define('map_point', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING},
    image_logo: {type: DataTypes.STRING, allowNull: false},
    images: {type: DataTypes.ARRAY(DataTypes.STRING)},
    videos: {type: DataTypes.ARRAY(DataTypes.STRING)},
    google_map_url: {type: DataTypes.STRING},
    deleted: {type: DataTypes.BOOLEAN, defaultValue: false},
    created_by_user_id: {type: DataTypes.INTEGER},
    created_date: {type: DataTypes.BIGINT},
    deleted_by_user_id: {type: DataTypes.INTEGER},
    deleted_date: {type: DataTypes.BIGINT}
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

const TopicsCategory = sequelize.define('topics_category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    category_name: {type: DataTypes.STRING, allowNull: false, unique: true},
    description: {type: DataTypes.STRING},
    is_active: {type: DataTypes.BOOLEAN, defaultValue: true},
    is_for_tour: {type: DataTypes.BOOLEAN, defaultValue: false},

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

})

User.hasOne(Guide)
Guide.belongsTo(User)

User.hasOne(Topics)
Topics.belongsTo(User)

Guide.hasMany(Tours)
Tours.belongsTo(Guide)

Tours.hasMany(MapPoint)
MapPoint.belongsTo(Tours)

Guide.hasMany(MapPoint)
MapPoint.belongsTo(Guide)

module.exports = {
    User,
    Guide,
    Tours,
    MapPoint,
    Topics,
    TableUpdates,
    Files,
    TopicsCategory,
}