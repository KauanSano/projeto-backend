const express = require("express");
const user = require("../model/user");
var jwt = require("jsonwebtoken");

module.exports = {
  list: async function () {
    var User = await user.Model.findAll();
    return User;
  },
  getByUsername: async function (name) {
    var User = await user.Model.findOne({ where: { username: name } });
    if (User) {
      return User;
    } else {
      return null;
    }
  },
  save: async function (username, password, isAdmin) {
    try {
      const User = await user.Model.create({
        username: username,
        password: password,
        isAdmin: isAdmin,
      });
      return User;
    } catch (e) {
      console.log(`Erro ao tentar salvar o usuário: ${e}`);
      return null;
    }
  },
  getUserById: async function (id) {
    var User = await user.Model.findOne({ where: { uid: id } });
    if (User) {
      return User;
    } else {
      return null;
    }
  },
  update: async function (id, name, password) {
    try {
      return await user.Model.update(
        { name: name, password: password },
        { where: { uid: id } }
      );
    } catch (e) {
      console.log(`Erro ao tentar atualizar o usuário: ${e}`);
      return null;
    }
  },
  verifyToken: function (req, res, next) {
    //metodo de exemplo do professor. nao consegui fazer funcionar com o .split
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
  },
  isAdminOrSelf: function (req, res, next) {
    //nao vai permitir acesso a rotas se o usuario nao for administrador
    //ou se estiver tentando acessar dados q nao correspondam ao id dele.
    const token = req.headers.authorization;
    const payload = jwt.decode(token);
    const { id } = req.params;
    if (payload.user.isAdmin || payload.user.uid == id) {
      console.log("Passou pelo método isAdminOrSelf! "); //teste
      next();
    } else {
      res.status(401).json({
        status: false,
        message:
          "Você não tem autorização para acessar ou alterar esses dados. ",
      });
    }
  },
};
