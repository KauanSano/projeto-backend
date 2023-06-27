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
  list: async function () {
    const Pokemon = await PokemonModel.findAll({
      include: {
        model: types.Model, //join com a tabela de tipos
        as: "Types",
      },
    });
    return Pokemon;
  },
  save: async function (name) {
    try {
      const Pokemon = await PokemonModel.create({ name: name });
      return Pokemon;
    } catch (e) {
      console.log(`Houve um erro tentando salvar o Pokémon: ${e}`);
      return null;
    }
  },
  returnById: async function (id) {
    var Pokemon = await PokemonModel.findAll({
      //caso existam duplicados, retorna tb
      where: { id: id },
      include: {
        model: types.Model,
        as: "Types",
      },
    });
    if (Pokemon) {
      return Pokemon;
    } else {
      return null;
    }
  },
  returnByName: async function (name) {
    var Pokemon = await PokemonModel.findOne({ where: { name: name } });
    if (Pokemon) {
      return Pokemon;
    } else {
      return null;
    }
  },

  Model: PokemonModel,
};
