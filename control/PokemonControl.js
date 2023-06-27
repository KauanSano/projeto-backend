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
  const allTypes = await types.Model.findAll();
  const pikachu = await pokemon.Model.findOne({ where: { id: 1 } });
  console.log(await pikachu.getTypes());
  console.log(JSON.stringify(allPokemons));

  res.render("pokedex", { bd: allPokemons, tipos: allTypes });
});

router.get("/list/pokemons", async (req, res) => {
  //reescrever com paginacao.
  let allPokemons = await pokemon.list();
  if (allPokemons) res.json(allPokemons);
  else res.status(404).json({ message: "Lista de usuários vazia." });
});

router.post("/views/pokedex/:name/:maintype/:secondtype", async (req, res) => {
  const name = req.params.name;
  const thisPokemonTypes = [];
  thisPokemonTypes.push(req.params.maintype);
  thisPokemonTypes.push(req.params.secondtype);
  const pokemonTypes = await types.Model.findAll({
    where: { id: { [Op.in]: thisPokemonTypes } },
  });
  console.log(JSON.stringify(pokemonTypes));
  if (
    pokemonTypes == null ||
    pokemonTypes.length == 0 ||
    pokemonTypes == undefined
  ) {
    return res
      .status(500)
      .json({ message: "Erro ao tentar criar o Pokémon. " });
  }
  const savedPokemon = await pokemon.save(name, pokemonTypes);
  savedPokemon.addTypes(pokemonTypes);
  console.log(JSON.stringify(savedPokemon));
  res.redirect("/list/pokemons");
});

//fazer funcao para gerar um JSON formatado

module.exports = router;
