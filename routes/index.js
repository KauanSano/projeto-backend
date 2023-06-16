const express = require('express');
var router = express.Router();
const UserDAO = require("../DAO/user")

router.get("/", (req, res) =>{
    res.json("Hello! ");
})

router.get("/users", async (req, res) => {
    let users = await UserDAO.list();
    if(users)
        res.json(users)
    else
        res.status(404).json({message: "nao foi possivel achar o usuario"})    
})

module.exports = router;