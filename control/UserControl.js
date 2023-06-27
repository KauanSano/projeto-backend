const express = require("express");
var router = express.Router();
const UserDAO = require("../model/user");
var jwt = require("jsonwebtoken");

const verifyToken = function (req, res, next) {
  let fullToken = req.headers.authorization;
  jwt.verify(fullToken, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      console.log(fullToken);
      res.status(403).json({
        status: false,
        message: `Acesso negado - código de erro: ${err}`,
      });
      return;
    }
    req.user = payload.user;
    console.log(payload);
    next();
  });
};

router.get("/listUsers", verifyToken, async (req, res) => {
  var users = await UserDAO.list();
  res.json({ status: true, users: users });
});

router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, password } = req.body;
  const updatedUser = UserDAO.getUserById(id);
  let obj = {};
  if (name) {
    obj.name = name;
  } else {
    obj.name = updatedUser.name;
  }
  if (password) {
    obj.password = password;
  } else {
    obj.password = updatedUser.password;
  }

  UserDAO.update(id, obj.name, obj.password).then((user) => {
    if (user) {
      return res.json({
        message: "Sucesso ao alterar o usuário: ",
        user: user,
      });
    } else {
      return res.status(403).json({
        message: "Erro ao tentar atualizar o usuário. ",
      });
    }
  });
});

router.get("/listUsers/:id", verifyToken, async (req, res) => {
  var user = await UserDAO.getUserById(req.params.id);
  if (!user) {
    res
      .status(404)
      .json({ status: false, message: "Usuário não encontrado. " });
  } else {
    res.json({ status: true, user: user });
  }
});

router.post("/login", async (req, res) => {
  var { username, password } = req.body;
  let loggedUser = await UserDAO.getByUsername(username);
  if (loggedUser != null && loggedUser.password == password) {
    //geracao de token de acordo com exemplo dado em aula com verificacao de senha
    let tokenjwt = jwt.sign({ user: loggedUser }, process.env.JWT_SECRET, {
      expiresIn: "30 min",
    });
    res.json({ status: true, token: tokenjwt }); //devolve o token para poder testar outras funcionalidades da api.
  } else {
    //erro login
    res.status(401).json({ status: false, message: "Credenciais inválidos." });
  }
});

module.exports = router;
