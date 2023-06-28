const pokemon = require("../model/pokemon");
const types = require("../model/types");
const sequelize = require("../helpers/db");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
//importando QueryTypes para exemplificar uma query em SQL puro
//isso eh necessario por conta da funcao ARRAY_AGG no Postgres

module.exports = {
  selectPokemons: async function () {
    const query = `SELECT p.id AS "PokemonId",
    p.name AS "PokemonName",
    ARRAY_AGG(t.id) AS "TypeIds",
    ARRAY_AGG(t.name) AS "TypeNames"
    FROM "Pokemons" p
    INNER JOIN "PokemonTypes" pt ON pt."PokemonId" = p.id
    INNER JOIN "Types" t ON t.id = pt."TypeId"
    GROUP BY p.id`;
    const pokemon = await sequelize.query(query, {
      type: QueryTypes.SELECT,
    });

    return pokemon;
  },
  list: async function () {
    const Pokemon = await pokemon.Model.findAll({
      include: {
        model: types.Model, //join com a tabela de tipos
        as: "Types",
      },
    });
    return Pokemon;
  },
  delete: async function (id) {
    try {
      return await pokemon.Model.destroy({
        where: {
          id: id,
        },
      });
    } catch (e) {
      console.log(`Erro ao tentar deletar o usuário: ${e}`);
      throw new Error(`Erro: ${e.message}`);
    }
  },
  save: async function (name) {
    try {
      const Pokemon = await pokemon.Model.create({ name: name });
      return Pokemon;
    } catch (e) {
      console.log(`Houve um erro tentando salvar o Pokémon: ${e}`);
      throw new Error(`Erro: ${e.message}`);
    }
  },
  returnById: async function (id) {
    let Pokemon = await pokemon.Model.findAll({
      //caso existam duplicados, retorna tb
      where: { id: id },
      include: {
        model: types.Model,
        as: "Types",
      },
    });
    if (Pokemon) {
      return Pokemon;
    } else {
      return null;
    }
  },
  returnByName: async function (name) {
    let Pokemon = await pokemon.Model.findOne({ where: { name: name } });
    if (Pokemon) {
      return Pokemon;
    } else {
      return null;
    }
  },
};
