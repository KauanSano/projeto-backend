const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");

const UserModel = sequelize.define("Users", {
  uid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: DataTypes.STRING,
  isAdmin: DataTypes.BOOLEAN,
});

module.exports = {
  list: async function () {
    var User = await UserModel.findAll();
    return User;
  },
  save: async function (username, isAdmin) {
    const User = await UserModel.create({
      username: username,
      isAdmin: isAdmin,
    });

    return User;
  },
  getUserById: async function (id) {
    var User = await UserModel.findOne({ where: { id: id } });
    if (User) {
      return User;
    } else {
      return null;
    }
  },
  Model: UserModel,
};
