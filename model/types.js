const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");

const TypesModel = sequelize.define("Types", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return this.getDataValue("name");
    },
    validate: {
      isAlpha: true,
      len: [1, 20],
    },
  },
});

module.exports = {
  Model: TypesModel,
};
