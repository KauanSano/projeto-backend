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
  let allPokemons = await PokemonControl.list();
  if (allPokemons) res.json(allPokemons);
  else res.status(404).json({ message: "Lista de usuários vazia." });
});

router.post("/views/pokedex/", async (req, res) => {
  const name = req.body.name;
  const thisPokemonTypes = [];
  thisPokemonTypes.push(req.body.typeOne);
  thisPokemonTypes.push(req.body.typeTwo);
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
  const savedPokemon = await PokemonControl.save(name, pokemonTypes);
  savedPokemon.addTypes(pokemonTypes);
  console.log(JSON.stringify(savedPokemon));
  res.redirect("/list/pokemons");
});

module.exports = router;
