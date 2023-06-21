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
      return this.getDataValue("typeName");
    },
    validate: {
      isAlpha: true, //apenas permite letras
      len: [1, 20],
    },
  },
});

module.exports = {
  list: async function () {
    const Type = await TypesModel.findAll();
    return Type;
  },
  save: async function (name) {
    try {
      const Type = await TypesModel.create({
        name: name,
      });
      return Type;
    } catch (e) {
      console.log(`Houve um erro ao tentar salvar o tipo: ${e}`);
      return null;
    }
  },
  getIdByName: async function (name) {
    try {
      var Type = await TypesModel.findOne({ where: { name: name } });
      return Type.id;
    } catch (e) {
      return e.message;
    }
  },
  getById: async function (id) {
    var obj = await TypesModel.findOne({ where: { id: id } });
    if (obj === null) {
      console.log("Não foi possível achar o objeto de TIPO pelo ID. ");
      return null;
    } else {
      return obj;
    }
  },
  getNameById: async function (id) {
    //alternando os select de where para findbypk, como exemplo
    var type = await TypesModel.findByPk(id);
    if (type === null) {
      console.log("Erro ao tentar procurar o tipo. ");
    } else {
      return type.name;
    }
  },
  Model: TypesModel,
};
