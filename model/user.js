const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");

//adicionar validacoes usuarios

const UserModel = sequelize.define("Users", {
  uid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  isAdmin: DataTypes.BOOLEAN,
});

module.exports = {
  list: async function () {
    var User = await UserModel.findAll();
    return User;
  },
  getByUsername: async function (name) {
    var User = await UserModel.findOne({ where: { username: name } });
    if (User) {
      return User;
    } else {
      return null;
    }
  },
  save: async function (username, password, isAdmin) {
    const User = await UserModel.create({
      username: username,
      password: password,
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
