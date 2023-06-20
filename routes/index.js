const express = require("express");
var router = express.Router();
const UserDAO = require("../model/user");

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

router.post("login", async (req, res) => {
  var { username, password } = req.body;
  let loggedUser = UserDAO.getByUsername(username);
  if (loggedUser != NULL && loggedUser.password === password) {
    //geracao de token de acordo com exemplo dado em aula com verificacao de senha
    let tokenjwt = jwt.sign({ user: loggedUser }, process.env.JWT_SECRET, {
      expiresIn: "30 min",
    });
    res.json({ status: true, token: tokenjwt }); //devolve o token para poder testar outras funcionalidades da api.
  } else {
    //erro login
    res
      .status(403)
      .json({ status: false, message: "Erro ao tentar efetuar o log-in." });
  }
});

module.exports = router;
