//remover console log
const TypesModel = require("../model/types");
module.exports = {
  list: async function () {
    const Type = await TypesModel.findAll();
    return Type;
  },
  save: async function (name) {
    const Type = await TypesModel.create({
      typeName: name,
    });

    return Type;
  },
  getByName: async function (name) {
    var Type = await TypesModel.findOne({ where: { typeName: name } });
    if (Type === null) {
      console.log("Tipo nao encontrado! ");
      return 0;
    } else {
      return Type.id;
    }
  },
  getById: async function (id) {
    var obj = await TypesModel.findOne({ where: { id: id } });
    if (obj === null) {
      console.log("Objeto nao encontrado! ");
      return null;
    } else {
      return obj;
    }
  },
  Model: TypesModel,
};