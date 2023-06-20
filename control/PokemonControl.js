const PokemonModel = require("../model/pokemon");

module.exports = {
  list: async function () {
    const Pokemon = await PokemonModel.findAll();
    return Pokemon;
  },
  save: async function (name, mainTypeId, secondaryTypeId) {
    const Pokemon = await PokemonModel.create({
      name: name,
      mainTypeId: mainTypeId,
      secondaryTypeId: secondaryTypeId,
    });

    return Pokemon;
  },
  returnById: async function (id) {
    var Pokemon = await PokemonModel.findOne({ where: { id: id } });
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
