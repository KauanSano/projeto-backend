const UserModel = require("../model/user");
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
    { name: "electric" },
    { name: "normal" },
    { name: "grass" },
    { name: "fire" },
    { name: "water" },
  ];
  let user = {
    name: "ADM",
    password: "1256555",
    admin: "true",
  };
  let users = [
    { name: "ADM", password: "123456", admin: true },
    { name: "Comum", password: "123456", admin: false },
  ];
  for (const user of users) {
    await UserModel.save(user.name, user.password, user.admin);
  }
  for (const type of types) {
    //for ... of é síncrono e garante que os dados sejam salvos adequadamente no banco
    console.log("Tentando gravar o seguinte tipo: ", type.name);
    try {
      var newType = await TypeModel.save(type.name);
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
      const newPokemon = await PokeModel.save(pokemon.name, thisPokemonTypes);
      newPokemon.addTypes(thisPokemonTypes);
      console.log(`Pokémon salvo com sucesso: ${newPokemon.name}`);
    } catch (e) {
      console.log(
        `Erro ao salvar esse Pokémon: ${pokemon.name}... Código de erro: ${e}`
      );
    }
  }
  //await UserModel.save(user.name, user.password, user.admin);
  let typeId = await TypeModel.getIdByName("aaaaa");
  console.log(typeId);
  res.json({
    message: "success",
    users: await UserModel.list(),
    types: await TypeModel.list(),
    pokemons: await PokeModel.list(),
    relationships: await pokemonRelTable.list(),
  });
});

module.exports = router;
