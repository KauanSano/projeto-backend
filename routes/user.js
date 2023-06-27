const express = require("express");
const router = express.Router();
const UserDAO = require("../model/user");
const UserControl = require("../control/UserControl");

router.get("/listUsers", UserControl.verifyToken, async (req, res) => {
  var users = await UserControl.list();
  res.json({ status: true, users: users });
});

router.put(
  "/:id",
  UserControl.verifyToken,
  UserControl.isAdminOrSelf,
  async (req, res) => {
    const { id } = req.params;
    const { name, password } = req.body;
    const updatedUser = UserControl.getUserById(id);
    let obj = {};
    if (name) {
      obj.name = name;
    } else {
      obj.name = updatedUser.name; //necessario para nao enviar null para o bd
    }
    if (password) {
      obj.password = password;
    } else {
      obj.password = updatedUser.password;
    }

    UserControl.update(id, obj.name, obj.password).then((user) => {
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
  }
);

router.get(
  "/listUsers/:id",
  UserControl.verifyToken,
  UserControl.isAdminOrSelf,
  async (req, res) => {
    var user = await UserControl.getUserById(req.params.id);
    if (!user) {
      res
        .status(404)
        .json({ status: false, message: "Usuário não encontrado. " });
    } else {
      res.json({ status: true, user: user });
    }
  }
);

router.post("/login", async (req, res) => {
  var { username, password } = req.body;
  let loggedUser = await UserControl.getByUsername(username);
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
