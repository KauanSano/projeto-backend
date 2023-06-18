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
    const User = await UserModel.findAll();
    return User;
  },
  save: async function (username, isAdmin) {
    const User = await UserModel.create({
      username: username,
      isAdmin: isAdmin,
    });

    return User;
  },

  Model: UserModel,
};
