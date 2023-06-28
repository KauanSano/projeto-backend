const pokemon = require("../model/pokemon");
const PokemonControl = require("../control/PokemonControl");
const types = require("../model/types");
const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();

router.get("/views/pokedex", async (req, res) => {
  const allPokemons = await PokemonControl.selectPokemons();
  const allTypes = await types.Model.findAll();
  const pikachu = await pokemon.Model.findOne({ where: { id: 1 } });
  console.log(await pikachu.getTypes());
  console.log(JSON.stringify(allTypes));

  res.render("pokedex", { bd: allPokemons, tipos: allTypes });
});

router.get("/list/pokemons", async (req, res) => {
  //reescrever com paginacao.
  let allPokemons = await PokemonControl.selectPokemonsWithTypes(2, 3);
  res.json({ obj: allPokemons });
});

router.get("/list/pagination", async (req, res) => {
  const { offset, limit } = req.body;
  let allPokemons = await PokemonControl.listPagination(offset, limit);
  res.json({ obj: allPokemons });
});

router.post("/views/pokedex/", async (req, res) => {
  const name = req.body.name;
  const thisPokemonTypes = [];
  const allPokemons = await PokemonControl.selectPokemons();
  const allTypes = await types.Model.findAll();
  thisPokemonTypes.push(req.body.typeOne);
  thisPokemonTypes.push(req.body.typeTwo);
  const pokemonTypes = await types.Model.findAll({
    where: {
      [Op.and]: [{ id: { [Op.gt]: 1 } }, { id: { [Op.in]: thisPokemonTypes } }],
    },
  });
  console.log(JSON.stringify(pokemonTypes));
  if (
    pokemonTypes == null ||
    pokemonTypes.length == 0 ||
    pokemonTypes == undefined ||
    name.length < 1
  ) {
    let err = {};
    err.erroMsg = "Erro ao tentar criar o Pokémon! ";
    return res.render("pokedex", {
      bd: allPokemons,
      tipos: allTypes,
      error: err,
    });
  }
  try {
    const savedPokemon = await PokemonControl.save(name, pokemonTypes);
    return res.render("pokedex", {
      bd: allPokemons,
      tipos: allTypes,
    });
  } catch (e) {
    let err = {};
    err.erroMsg += e.message;
    return res.render("pokedex", {
      bd: allPokemons,
      tipos: allTypes,
      error: err,
    });
  }
});

module.exports = router;
