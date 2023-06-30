const express = require("express");
const router = express.Router();
const UserControl = require("../control/UserControl");
const jwt = require("jsonwebtoken");

router.get(
  "/listUsers",
  UserControl.verifyToken,
  UserControl.isAdmin,
  async (req, res) => {
    let users = await UserControl.list();
    res.json({ status: true, users: users });
  }
);

router.delete("/deleteUser/:id", UserControl.isAdmin, async (req, res) => {
  const { id } = req.params;
  let User = await UserControl.getUserById(id);
  if (User == null) {
    return res
      .status(404)
      .json({ status: false, message: "Não existe um usuário com esse ID. " });
  }
  if (User.isAdmin == true) {
    return res.status(500).json({
      status: false,
      message:
        "Não é possível excluir um usuário com privilégios de administrador. ",
    });
  }

  UserControl.delete(id)
    .then((user) => {
      return res.status(200).json({
        message: "Sucesso ao excluir o usuário. ",
        deletedId: id,
      });
    })
    .catch((e) => {
      return res
        .status(500)
        .json({ message: `Falha ao tentar deletar o usuário: ${e.message}` });
    });
});

router.put(
  "/:id",
  UserControl.verifyToken,
  UserControl.isAdminOrSelf,
  async (req, res) => {
    const { id } = req.params;
    const { name, password, email } = req.body;
    let obj = {};
    if (name) {
      obj.name = name;
    }
    if (password) {
      obj.password = password;
    }
    if (email) {
      obj.email = email;
    }
    UserControl.update(id, obj.name, obj.password, obj.email)
      .then((user) => {
        return res.status(200).json({
          message: "Sucesso ao alterar o usuário! ",
          userId: user,
          user: obj,
        });
      })
      .catch((e) => {
        return res.status(500).json({
          message: `Falha ao tentar alterar o usuário, ${e.message}`,
        });
      });
  }
);

router.put(
  "/giveAdmin/:id",
  UserControl.verifyToken,
  UserControl.isAdmin,
  async (req, res) => {
    const { id } = req.params;
    const updatedUser = await UserControl.getUserById(id);
    if (updatedUser == null) {
      return res.status(404).json({
        status: false,
        message: "Não foi possível achar o usuário com esse id. ",
      });
    }
    if (updatedUser.isAdmin == false) {
      UserControl.giveUserAdmin(id)
        .then((user) => {
          return res.status(200).json({
            message:
              "Sucesso: permissões de administrador concedidas para o usuário. ",
            user: user,
          });
        })
        .catch((e) => {
          return res.status(500).json({
            message: `Falha ao tentar dar permissões de admin para o usuário, ${e.message}`,
          });
        });
    } else {
      return res.status(403).json({
        message: "O usuário já é administrador... ",
        user: updatedUser,
      });
    }
  }
);

router.get(
  "/listUsers/:id",
  UserControl.verifyToken,
  UserControl.isAdminOrSelf,
  async (req, res) => {
    let user = await UserControl.getUserById(req.params.id);
    if (!user) {
      res
        .status(404)
        .json({ status: false, message: "Usuário não encontrado. " });
    } else {
      res.status(200).json({ status: true, user: user });
    }
  }
);

router.get("/views/login", async (req, res) => {
  res.render("login");
});

router.post("/views/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(username);
  console.log(password);
  if (username == undefined || password == undefined) {
    return res.status(401).redirect("/views/login");
  }

  let loggedUser = await UserControl.getByUsername(username);
  console.log(JSON.stringify(loggedUser));
  if (loggedUser != null && loggedUser.password == password) {
    let tokenjwt = jwt.sign({ user: loggedUser }, process.env.JWT_SECRET, {
      expiresIn: "20 min",
    });
    console.log("logou!");
    return res.cookie("token", tokenjwt).json({ status: true, token: tokenjwt });
  } else {
    //erro login!
    return res.status(401).redirect("/views/login");
  }
});

router.post("/login", async (req, res) => {
  let { username, password } = req.body;
  let loggedUser = await UserControl.getByUsername(username);
  if (loggedUser != null && loggedUser.password == password) {
    UserControl.counter(loggedUser.uid).then(() => {
      console.log("mais um login");
    }).catch((e) => {
      console.log(e);
    });
    //geracao de token de acordo com exemplo dado em aula com verificacao de senha
    let tokenjwt = jwt.sign({ user: loggedUser }, process.env.JWT_SECRET, {
      expiresIn: "30 min",
    });
    return res.cookie("token", tokenjwt, {maxAge: 720000}).json({ status: true, token: tokenjwt });
  } else {
    //erro login
    res.status(401).json({ status: false, message: "Credenciais inválidos." });
  }
});

router.post("/register", async (req, res) => {
  let { username, password, email } = req.body;
  try {
    let createdUser = await UserControl.save(username, password, false, email);
    res
      .status(201)
      .json({ status: true, message: "Usuário criado: ", user: createdUser });
  } catch (e) {
    res.status(500).json({
      status: false,
      message: "Erro ao tentar criar o usuário. ",
      error: e.message,
    });
  }
});

//alteração sugerida em aula
router.get("/counter/:id", UserControl.isAdminOrSelf, async (req, res) => {
  let id = req.params.id;
  let user = await UserControl.getUserById(id);
  
  res.status(200).json({status: true, message: `Vezes que o usuário fez log-in: `, number: user.loginCounter});
})
module.exports = router;
