const UserControl = require("../control/UserControl");
const PokeControl = require("../control/PokemonControl");
const TypeControl = require("../control/TypeControl");
const PokeModel = require("../model/pokemon");
const TypeModel = require("../model/types");
const pokemonRelTable = require("../model/pokemonTypes");
const { Op } = require("sequelize");
const express = require("express");
const router = express.Router();
const db = require("./db");

//mudar para array de objetos

router.get("/install", async (req, res) => {
  await db.sync({ force: true });
  let pokemons = [
    { name: "pikachu", types: [1, 2] },
    { name: "squirtle", types: [5] },
    { name: "charmander", types: [4] },
    { name: "bulbasaur", types: [3] },
    { name: "eevee", types: [2] },
  ];
  let types = [
    { name: "none" },
    { name: "electric" },
    { name: "normal" },
    { name: "grass" },
    { name: "fire" },
    { name: "water" },
  ];
  let users = [
    { name: "ADM", password: "123456", admin: true, email: "adm@gmail.com" },
    {
      name: "Comum",
      password: "123456",
      admin: false,
      email: "comum@gmail.com",
    },
  ];
  for (const user of users) {
    await UserControl.save(user.name, user.password, user.admin, user.email);
  }
  for (const type of types) {
    //for ... of é síncrono e garante que os dados sejam salvos adequadamente no banco
    console.log("Tentando gravar o seguinte tipo: ", type.name);
    try {
      var newType = await TypeControl.save(type.name);
      console.log(`Tipo salvo com sucesso: ${newType.name}`);
    } catch (e) {
      console.log(
        `Erro ao salvar o tipo: ${type.name}... Código de erro: ${e}`
      );
    }
  }

  for (const pokemon of pokemons) {
    console.log("Tentando gravar o seguinte Pokémon: ", pokemon.name);
    try {
      const thisPokemonTypes = await TypeModel.Model.findAll({
        where: { id: { [Op.in]: pokemon.types } },
      });
      console.log(`Tipos do ${pokemon.name}: ${types}`);
      const newPokemon = await PokeControl.save(pokemon.name, thisPokemonTypes);
      newPokemon.addTypes(thisPokemonTypes);
      console.log(`Pokémon salvo com sucesso: ${newPokemon.name}`);
    } catch (e) {
      console.log(
        `Erro ao salvar esse Pokémon: ${pokemon.name}... Código de erro: ${e}`
      );
    }
  }
  //await UserControl.save(user.name, user.password, user.admin);
  let typeId = await TypeControl.getIdByName("aaaaa");
  console.log(typeId);
  res.json({
    message: "success",
    users: await UserControl.list(),
    types: await TypeControl.list(),
    pokemons: await PokeControl.list(),
    relationships: await pokemonRelTable.list(),
  });
});

module.exports = router;
