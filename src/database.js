const mongoose = require("mongoose");
const ProductModel = require("./dao/mongoDb/modelsDB/products.model");

const main = async () => {
  mongoose
    .connect(
      "mongodb+srv://williamjoseanez:William17735207@cluster0.fpryakl.mongodb.net/ecommerce?retryWrites=true&w=majority"
    )
    .then(() => console.log("conectado a la base de datos mongoDB"))
    .catch((error) => console.error(error));

  const result = await ProductModel.aggregate([
    {
      $match: {
        category: "sin especificar"
      }
    },
    {
      $group: {
        _id: "$title",
        totalPrice: {
          $sum: "$price"
        }
      }
    },
    {
      // para ordenar de mayor a menor o visceversa
      // 1: ascendente
      // -1: descendente
      $sort: {
        totalPrice: -1
      }
    },
    {
      $group: {

        
        _id: 1,
        products: {
          $push: "$$ROOT"
        }
      }
    },
    {
      $project: {
        "_id": 0,
        products: "$products"
      }
    },
    {
      $merge: {
        into: "reports"
      }
    }
  ])
  console.log(result);
};

main();
