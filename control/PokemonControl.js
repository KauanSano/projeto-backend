const pokemon = require("../model/pokemon");
const pokemontypes = require("../model/pokemonTypes");
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
  listPagination: async function (limit, page) {
    // pagina 0 x limite 5, offset = 0. retorna até o cinco. pagina 1 x limite 5, retorna a partir do 5.
    if(page > 0) {
      page = page - 1; 
    }
    let offset = (page) * limit;
    console.log(offset);
    if(offset < 0) {
      offset = offset * -1;
    }
    console.log(offset);
    const pokemons = await pokemon.Model.findAll({
      include: {
        model: types.Model,
        as: "Types",
      },
      offset: offset,
      limit: limit,
    });
    console.log(JSON.stringify(pokemons));
    return pokemons;
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
    if(id < 1 || id == undefined) {
      return null;
    }
    await pokemontypes.Model.destroy({
      where: {PokemonId: id}
    })
    const Pokemon = await pokemon.Model.findOne({
      where: {id: id}
    })
    Pokemon.removeTypes();
    try {
      return await pokemon.Model.destroy({
        where: {
          id: id,
        },
      });
    } catch (e) {
      console.log(`Erro ao tentar deletar o Pokémon: ${e.message}`);
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
  update: async function(id, name, typeOne, typeTwo) {
    console.log(id);
    if(id === null || isNaN(id) || id === undefined) {
      return null;
    }
    const thisPokemonTypes = []
    if(typeOne > 1) {
      thisPokemonTypes.push(typeOne);
    }
    if(typeTwo > 1) {
      thisPokemonTypes.push(typeTwo);
    }
    if (thisPokemonTypes.length == 0) {
      console.log("array vazio");
      return null;
    }
    try {
      const UpdatedTypes = await pokemon.Model.findOne({
        where: {id: id},
        include: types.Model,
        as: "Types"
      })
      UpdatedTypes.setTypes([]);
      UpdatedTypes.setTypes(thisPokemonTypes);
    } catch (e) {
      console.log(`Houve um erro tentando atualizar o Pokémon: ${e}`)
      throw new Error(`Erro: ${e.message}`);
    }
    try {
      return await pokemon.Model.update(
        { name: name },
        { where: {id: id }}
      );
    } catch(e) {
      console.log(`Houve um erro tentando atualizar o Pokémon: ${e}`)
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
