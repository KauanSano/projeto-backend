const Sequelize = require("sequelize");

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    define: {
      timestamps: false,
    },
  }
);

//query para criacao do banco de dados caso ele nao exista. para que funcione,
//precisa substituir o process.env.DB_NAME por "".
//db.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`).then(() => console.log("SUCCESS CREATING DATABASE! "))

db.authenticate()
  .then(() => console.log("POSTGRES ONLINE!"))
  .catch((error) => console.log(error));

module.exports = db;
