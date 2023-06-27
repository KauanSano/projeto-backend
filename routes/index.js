const express = require("express");
const router = express.Router();

//to-do: rotas para criacao de adms (deve ser somente acessada por adms)
//!!!!!! paginacao para TODOS os metodos de listagem. !!!!!!

router.get("/", (req, res) => {
  //rota de teste.
  res.json("Hello! ");
});

module.exports = router;
