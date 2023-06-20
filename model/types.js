const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");

const TypesModel = sequelize.define("Types", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  typeName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isAlpha: true, //apenas permite letras
      len: [1, 20],
    },
  },
});

//mudar os console.log para json!

module.exports = {
  list: async function () {
    const Type = await TypesModel.findAll();
    return Type;
  },
  save: async function (name) {
    const Type = await TypesModel.create({
      typeName: name,
    });

    return Type;
  },
  getByName: async function (name) {
    var Type = await TypesModel.findOne({ where: { typeName: name } });
    if (Type === null) {
      console.log("Tipo nao encontrado! ");
      return 0;
    } else {
      return Type.id;
    }
  },
  getById: async function (id) {
    var obj = await TypesModel.findOne({ where: { id: id } });
    if (obj === null) {
      console.log("Objeto nao encontrado! ");
      return 0;
    } else {
      return obj;
    }
  },
  Model: TypesModel,
};
