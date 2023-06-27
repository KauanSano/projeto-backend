const express = require("express");
const router = express.Router();
const UserDAO = require("../model/user");
const pokemonDAO = require("../model/pokemon");
const typeDAO = require("../model/types");

var jwt = require("jsonwebtoken");

//to-do: rotas para criacao de adms (deve ser somente acessada por adms)
//!!!!!! paginacao para TODOS os metodos de listagem. !!!!!!

router.get("/", (req, res) => {
  //rota de teste.
  res.json("Hello! ");
});

router.get("/users", async (req, res) => {
  //reescrever com paginacao.
  let users = await UserDAO.list();
  if (users) res.json(users);
  else res.status(404).json({ message: "Lista de usuários vazia." });
});

module.exports = router;
