const express = require("express");
var router = express.Router();
const UserDAO = require("../model/user");

//to-do: JWT e rotas para criacao de adms (deve ser somene acessada por adms)
//e rota para alterar dados de usuarios. gerar token e fazer os testes no postman.

router.get("/", (req, res) => {
  res.json("Hello! ");
});

router.get("/users", async (req, res) => {
  let users = await UserDAO.list();
  if (users) res.json(users);
  else res.status(404).json({ message: "nao foi possivel achar o usuario" });
});

router.post("login", async (req, res) => {
  var user = req.params;
  res.end();
});

module.exports = router;
