const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");
const types = require("./types.js");

const PokemonModel = sequelize.define("Pokemon", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isAlpha: true,
      len: [1, 25],
    },
  },
  mainTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: types.Model,
      key: "id",
    },
  },
  secondaryTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: types.Model,
      key: "id",
    },
  },
});

//PokemonModel.hasMany(types.Model);
//types.Model.belongsTo(PokemonModel);

module.exports = {
  list: async function () {
    const Pokemon = await PokemonModel.findAll({ include: types.TypesModel });
    return Pokemon;
  },
  save: async function (name, mainTypeId, secondaryTypeId) {
    const Pokemon = await PokemonModel.create({
      name: name,
      mainTypeId: mainTypeId,
      secondaryTypeId: secondaryTypeId,
    });

    return Pokemon;
  },
  returnById: async function (id) {
    var Pokemon = await PokemonModel.findOne({ where: { id: id } });
    if (Pokemon) {
      return Pokemon;
    } else {
      return null;
    }
  },
  returnByName: async function (name) {
    var Pokemon = await PokemonModel.findOne({ where: { name: name } });
    if (Pokemon) {
      return Pokemon;
    } else {
      return null;
    }
  },
  Model: PokemonModel,
};
