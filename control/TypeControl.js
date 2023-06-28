//remover console log
const types = require("../model/types");
module.exports = {
  list: async function () {
    const Type = await types.Model.findAll();
    return Type;
  },
  save: async function (name) {
    try {
      const Type = await types.Model.create({
        name: name,
      });
      return Type;
    } catch (e) {
      console.log(`Houve um erro ao tentar salvar o tipo: ${e}`);
      return null;
    }
  },
  getIdByName: async function (name) {
    try {
      let Type = await types.Model.findOne({ where: { name: name } });
      return Type.id;
    } catch (e) {
      return e.message;
    }
  },
  getById: async function (id) {
    let obj = await types.Model.findOne({ where: { id: id } });
    if (obj === null) {
      console.log("Não foi possível achar o objeto de TIPO pelo ID. ");
      return null;
    } else {
      return obj;
    }
  },
};
