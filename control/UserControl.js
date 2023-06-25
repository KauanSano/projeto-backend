const express = require("express");
var router = express.Router();
const UserDAO = require("../model/user");
var jwt = require("jsonwebtoken");

const verifyToken = function (req, res, next) {
  const auth = req.headers.authorization;
  console.log(auth);
  if (!auth) {
    return res.status(401).json({ status: false, message: "Acesso negado. " });
  }
  try {
    const validToken = jwt.verify(auth, process.env.JWT_SECRET);
    req.user = validToken;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ status: false, message: "Problema com o token: " + err });
  }
};

router.get("/listUsers", verifyToken, async (req, res) => {
  var users = await UserDAO.list();
  res.json({ status: true, users: users });
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
    res
      .status(403)
      .json({ status: false, message: "Erro ao tentar efetuar o log-in." });
  }
});

module.exports = router;
