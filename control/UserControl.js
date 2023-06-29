const express = require("express");
const user = require("../model/user");
const jwt = require("jsonwebtoken");

module.exports = {
  list: async function () {
    let User = await user.Model.findAll();
    return User;
  },
  getByUsername: async function (name) {
    let User = await user.Model.findOne({ where: { username: name } });
    if (User) {
      return User;
    } else {
      return null;
    }
  },
  save: async function (username, password, isAdmin, email) {
    try {
      const User = await user.Model.create({
        username: username,
        password: password,
        isAdmin: isAdmin,
        email: email,
      });
      return User;
    } catch (e) {
      console.log(`Erro ao tentar salvar o usuário: ${e}`);
      throw new Error(`${e.message}`);
    }
  },
  delete: async function (id) {
    try {
      return await user.Model.destroy({
        where: {
          uid: id,
        },
      });
    } catch (e) {
      throw new Error(`${e.message}`);
    }
  },
  giveUserAdmin: async function (id) {
    try {
      return await user.Model.update({ isAdmin: true }, { where: { uid: id } });
    } catch (e) {
      throw new Error(`${e.message}`);
    }
  },
  getUserById: async function (id) {
    let User = await user.Model.findOne({ where: { uid: id } });
    if (User) {
      return User;
    } else {
      return null;
    }
  },
  update: async function (id, name, password, email) {
    try {
      return await user.Model.update(
        { username: name, password: password, email: email },
        { where: { uid: id } }
      );
    } catch (e) {
      console.log(`Erro ao tentar atualizar o usuário: ${e}`);
      throw new Error(`${e.message}`);
    }
  },
  verifyToken: function (req, res, next) {
    //metodo de exemplo do professor. nao consegui fazer funcionar com o .split
    let fullToken = req.cookies.token;
    console.log(req.cookies.token);
    if (!fullToken) {
      return res.status(403).json({
        status: false,
        message: `Acesso negado.  `
      })
    }
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
      next();
    });
  },
  isAdminOrSelf: function (req, res, next) {
    //nao vai permitir acesso a rotas se o usuario nao for administrador
    //ou se estiver tentando acessar dados q nao correspondam ao id dele.
    const token = req.cookies.token;
    const payload = jwt.decode(token);
    const { id } = req.params;
    if (payload.user.isAdmin || payload.user.uid == id) {
      console.log("Passou pelo método isAdminOrSelf! "); //teste
      next();
    } else {
      res.status(403).json({
        status: false,
        message:
          "Você não tem autorização para acessar ou alterar esses dados. ",
      });
    }
  },
  isAdmin: function (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Token não encontrado. ",
      });
    }
    const payload = jwt.decode(token);
    if (payload.user.isAdmin) {
      next();
    } else {
      res.status(403).json({
        status: false,
        message: "Restrito para administradores.",
      });
    }
  },
};
