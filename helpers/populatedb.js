const UserModel = require("../model/user");
const PokeModel = require("../model/pokemon");
const TypeModel = require("../model/types");
const express = require("express");
const router = express.Router();
const db = require("./db");

//mudar para array de objetos

router.get("/install", async (req, res) => {
  await db.sync({ force: true });
  let pokemons = [
    { name: "pikachu", mainTypeId: 1, secondaryTypeId: null },
    { name: "squirtle", mainTypeId: 5, secondaryTypeId: null },
    { name: "charmander", mainTypeId: 4, secondaryTypeId: null },
    { name: "bulbasaur", mainTypeId: 3, secondaryTypeId: null },
    { name: "eevee", mainTypeId: 2, secondaryTypeId: null },
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
    password: "1234",
    admin: "false",
  };
  types.forEach(async (aux) => {
    await TypeModel.save(aux.name);
  });
  pokemons.forEach(async (aux) => {
    await PokeModel.save(aux.name, aux.mainTypeId, aux.secondaryTypeId);
  });
  await UserModel.save(user.name, user.password, user.admin);
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
