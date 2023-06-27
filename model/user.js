const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");

//adicionar validacoes usuarios

const UserModel = sequelize.define("Users", {
  uid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [6, 30], msg: "A senha deve ter entre 6 e 30 caracteres. " },
    },
  },
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
    try {
      const User = await UserModel.create({
        username: username,
        password: password,
        isAdmin: isAdmin,
      });
      return User;
    } catch (e) {
      console.log(`Erro ao tentar salvar o usuário: ${e}`);
      return null;
    }
  },
  getUserById: async function (id) {
    var User = await UserModel.findOne({ where: { uid: id } });
    if (User) {
      return User;
    } else {
      return null;
    }
  },
  update: async function (id, name, password) {
    try {
      return await UserModel.update(
        { name: name, password: password },
        { where: { uid: id } }
      );
    } catch (e) {
      console.log(`Erro ao tentar atualizar o usuário: ${e}`);
      return null;
    }
  },
  Model: UserModel,
};
