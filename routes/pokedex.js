const UserControl = require("../control/UserControl");
const PokemonControl = require("../control/PokemonControl");
const types = require("../model/types");
const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();

router.get("/views/pokedex", UserControl.verifyToken, async (req, res) => {
  console.log(req.cookies.token);
  const allPokemons = await PokemonControl.selectPokemons();
  const allTypes = await types.Model.findAll();
  res.render("pokedex", { bd: allPokemons, tipos: allTypes });
});

router.get("/list/pokemons", async (req, res) => {
  let allPokemons = await PokemonControl.list();
  res.json({ obj: allPokemons });
});

router.get("/list/pagination", async (req, res) => {
  const {limit, page} = req.body;
  let allPokemons = await PokemonControl.listPagination(limit, page);
  res.json({ obj: allPokemons });
});

router.put("/views/pokedex", UserControl.isAdmin, async (req, res) => {
  console.log("Put route");
  const id = req.body.id;
  const name = req.body.name;
  const updatedPokemon = PokemonControl.update(id, name, req.body.typeOne, req.body.typeTwo);
  return res.status(200).json({status: true, obj: updatedPokemon});
})

router.post("/views/pokedex/", UserControl.isAdmin, async (req, res) => {
  const name = req.body.name;
  const thisPokemonTypes = [];
  const allPokemons = await PokemonControl.selectPokemons();
  thisPokemonTypes.push(req.body.typeOne);
  thisPokemonTypes.push(req.body.typeTwo);
  const pokemonTypes = await types.Model.findAll({
    where: {
      [Op.and]: [{ id: { [Op.gt]: 1 } }, { id: { [Op.in]: thisPokemonTypes } }],
    },
  });

  if (
    pokemonTypes == null ||
    pokemonTypes.length == 0 ||
    pokemonTypes == undefined || name == undefined ||
    name.length < 1
  ) {
    return res
      .status(500)
      .json({ status: false, message: "Erro ao tentar criar o Pokémon! " });
  }
  try {
    const savedPokemon = await PokemonControl.save(name, pokemonTypes);
    savedPokemon.addTypes(pokemonTypes);
    console.log(JSON.stringify(allPokemons));
    console.log(JSON.stringify(savedPokemon) + JSON.stringify(pokemonTypes));
    return res.status(200).json({ status: true, obj: savedPokemon });
  } catch (e) {
    return res.status(500).json({ status: false, message: `Erro: ${e}` });
  }
});

/* router.post("/views/pokedex/", async (req, res) => {
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
    savedPokemon.addTypes(pokemonTypes);
    console.log(JSON.stringify(allPokemons));
    console.log(JSON.stringify(savedPokemon) + JSON.stringify(pokemonTypes));
    return res.render("pokedex", {
      bd: allPokemons,
      tipos: allTypes,
    });
  } catch (e) {
    let err = {};
    err.erroMsg += e;
    return res.render("pokedex", {
      bd: allPokemons,
      tipos: allTypes,
      error: err,
    });
  }
}); */

module.exports = router;
