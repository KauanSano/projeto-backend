const express = require("express");
var router = express.Router();
const UserDAO = require("../model/user");
const pokemonDAO = require("../model/pokemon");
const typeDAO = require("../model/types");

var jwt = require("jsonwebtoken");

//to-do: rotas para criacao de adms (deve ser somente acessada por adms)
//!!!!!! paginacao para TODOS os metodos de listagem. !!!!!!
//secret jwt para administradores. tera q alterar a rota de login
//adaptacao dos metodos de listagem dos pokemons. insercao de chaves estrangeiras no modelo.
//e rota para alterar dados de usuarios. gerar token e fazer os testes no postman.

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
