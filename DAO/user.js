const {DataTypes} = require("sequelize");
const sequelize = require("../helpers/db");

const UserModel = sequelize.define('User',
    {
        uid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: DataTypes.STRING,
        isAdmin: DataTypes.BOOLEAN
    }
)

module.exports = {
    list: async function() {
        const users = await UserModel.findAll()
        return users
    },
    save: async function(username, isAdmin) {
        const users = await UserModel.create({
            username: username,
            isAdmin: isAdmin
        })

        return users
    },
     
    Model: UserModel
}