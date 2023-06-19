const pokemonDAO = require("./pokemon");
const typesDAO = require("./types");
const sequelize = require("../helpers/db");
const { DataTypes } = require("sequelize");
const pokemon = require("./pokemon");

//adicionar paginacao

const PokemonTypes = sequelize.define("PokemonTypes", {
  PokeId: {
    type: DataTypes.INTEGER,
    references: {
      model: pokemonDAO.Model,
      key: "id",
    },
  },
  TypeId: {
    type: DataTypes.INTEGER,
    references: {
      model: typesDAO.Model,
      key: "id",
    },
  },
});

module.exports = {
  relationshipInit: async function () {
    typesDAO.Model.belongsToMany(pokemonDAO.Model, {
      through: "PokemonTypes",
      foreignKey: "typesPokemon",
    });
    pokemonDAO.Model.belongsToMany(typesDAO.Model, {
      through: "PokemonTypes",
      foreignKey: "pokemonTypes",
    });
  },
  save: async function (pokeId, typeId) {
    const rel = await PokemonTypes.create({
      PokeId: pokeId,
      TypeId: typeId,
    });
    return rel;
  },
  list: async function () {
    var relationships = await PokemonTypes.findAll();
    return relationships;
  },
  Model: PokemonTypes,
};
