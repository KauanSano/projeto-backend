const UserModel = require("../model/user");
const PokeModel = require("../model/pokemon");
const TypeModel = require("../model/types");
const relationships = require("../model/relationships");
const express = require("express");
const router = express.Router();
const db = require("./db");

//mudar para array de objetos

router.get("/install", async (req, res) => {
  await db.sync({ force: true });
  relationships.relationshipInit;
  let pokemons = [
    { name: "pikachu" },
    { name: "squirtle" },
    { name: "charmander" },
    { name: "bulbasaur" },
    { name: "eevee" },
  ];
  let types = [
    { name: "electric" },
    { name: "normal" },
    { name: "grass" },
    { name: "fire" },
    { name: "water" },
  ];
  let user = {
    name: "Um",
    admin: "false",
  };
  for (let i = 0; i < pokemons.length; i++) {
    await PokeModel.save(pokemons[i].name);
  }
  for (let j = 0; j < types.length; j++) {
    await TypeModel.save(types[j].name);
  }
  await UserModel.save(user.name, user.admin);
  await relationships.save(1, await TypeModel.getByName("electric"));
  await relationships.save(2, await TypeModel.getByName("water"));
  await relationships.save(3, await TypeModel.getByName("fire"));
  await relationships.save(4, await TypeModel.getByName("grass"));
  await relationships.save(5, await TypeModel.getByName("normal"));
  let typeId = await TypeModel.getByName("aaaaa");
  console.log(typeId);
  res.json({
    message: "success",
    objUm: await UserModel.list(),
    objDois: await TypeModel.list(),
    objTres: await PokeModel.list(),
  });
});

module.exports = router;
