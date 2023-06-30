const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");

//adicionar um atributo int no usuario
//cada login aumentar o contador
//criar uma rota que mostre o valor

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
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: { args: true, msg: "Insira um e-mail válido. " },
      notNull: {
        msg: "Insira um e-mail.",
      },
    },
  },
  loginCounter: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = {
  Model: UserModel,
};
