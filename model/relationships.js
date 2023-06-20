const pokemonDAO = require("./pokemon");
const typesDAO = require("./types");
const sequelize = require("../helpers/db");
const { DataTypes } = require("sequelize");
const pokemon = require("./pokemon");

//adicionar paginacao

const PokemonTypes = sequelize.define("PokemonTypes", {
  PokeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: pokemonDAO.Model,
      key: "id",
    },
  },
  MainTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: typesDAO.Model,
      key: "id",
    },
  },
  SecondaryTypeId: {
    type: DataTypes.INTEGER,
    allowNull: true, //o pokemon pode NAO ter um segundo tipo. caso seja vazio, basta devolver outro valor no SELECT.
    references: {
      model: typesDAO.Model,
      key: "id",
    },
  },
});

module.exports = {
  relationshipInit: async function () {
    pokemonDAO.Model.hasMany(typesDAO.Model, {
      through: "PokemonTypes",
      foreignKey: "pokemonTypes",
    });
    typesDAO.Model.belongsToMany(pokemonDAO.Model, {
      through: "PokemonTypes",
      foreignKey: "typesPokemon",
    });
  },
  save: async function (pokeId, mainTypeId, secTypeId) {
    const rel = await PokemonTypes.create({
      PokeId: pokeId,
      MainTypeId: mainTypeId,
      SecondaryTypeId: secTypeId,
    });
    return rel;
  },
  list: async function () {
    //vai listar so os ids das relacoes, sem trazer os pokemons e os tipos.
    var relationships = await PokemonTypes.findAll();
    return relationships;
  },
  listWithPokemonsAndTypes: async function () {
    PokemonTypes.forEach((teste) => {});
    /*
    var relSheet = [];
    for (let i = 1; i < PokemonTypes.length; i++) {
      relSheet = [
        {
          pokemon: await pokemonDAO.returnById(PokemonTypes[i].PokeId),
          tipo: await typesDAO.getById(PokemonTypes[i].MainTypeId),
          tipoDois: await typesDAO.getById(PokemonTypes[i].SecondaryTypeId),
        },
      ];
    }
    return relSheet;
    */
    console.log("nao funciona");
  },
  Model: PokemonTypes,
};
