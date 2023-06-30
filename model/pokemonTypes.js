const pokemonDAO = require("./pokemon");
const typesDAO = require("./types");
const sequelize = require("../helpers/db");
const { DataTypes } = require("sequelize");

const PokemonTypes = sequelize.define("PokemonTypes", {
  PokemonId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: pokemonDAO.Model,
      key: "id",
    },
  },
  TypeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: typesDAO.Model,
      key: "id",
    },
  },
});

module.exports = {
  list: async function () {
    const relations = await PokemonTypes.findAll();
    return relations;
  },
  Model: PokemonTypes,
};
