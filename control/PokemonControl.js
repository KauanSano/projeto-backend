const pokemon = require("../model/pokemon");
const types = require("../model/types");
const express = require("express");
const router = express.Router();
const sequelize = require("../helpers/db");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
//importando QueryTypes para exemplificar uma query em SQL puro
//isso eh necessario por conta da funcao ARRAY_AGG no Postgres,
//que consegue me organizar os dados de TIPOS de pokemon
//isso e provisorio.

async function selectPokemons() {
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
}

router.get("/views/pokedex", async (req, res) => {
  const allPokemons = await selectPokemons();
  const pikachu = await pokemon.Model.findOne({ where: { id: 1 } });
  console.log(await pikachu.getTypes());
  console.log(JSON.stringify(allPokemons));

  res.render("pokedex", { bd: allPokemons });
});

//fazer funcao para gerar um JSON formatado

async function formatJson(objId, objName, mainTypeId, secondTypeId) {
  let formattedJson = {
    id: objId,
    name: objName,
    mainType: await types.getNameById(mainTypeId),
    secondaryType: await types.getNameById(secondTypeId),
  };
  return formattedJson;
}

module.exports = router;
