const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");

const PokemonModel = sequelize.define("Pokemon", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
});

module.exports = {
  list: async function () {
    const Pokemon = await PokemonModel.findAll();
    return Pokemon;
  },
  save: async function (name) {
    const Pokemon = await PokemonModel.create({
      name: name,
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
