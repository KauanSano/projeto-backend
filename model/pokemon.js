const { DataTypes } = require("sequelize");
const sequelize = require("../helpers/db");
const types = require("./types.js");

const PokemonModel = sequelize.define("Pokemon", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isAlpha: {
        args: true,
        msg: "O nome do Pokémon não pode conter caracteres especiais ou números. ",
      },
      len: {
        args: [1, 25],
        msg: "O nome do Pokémon deve ter entre 1 e 25 caracteres. ",
      },
    },
  },
});

PokemonModel.belongsToMany(types.Model, { through: "PokemonTypes" });
types.Model.belongsToMany(PokemonModel, { through: "PokemonTypes" });

module.exports = {
  Model: PokemonModel,
};
