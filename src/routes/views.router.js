const express = require("express");
const router = express.Router();
const ProductManager = require("../controlles/product-Manager");
const products = new ProductManager("./src/models/products.json");
const productsModel = require("../models/products.model");
const mongoose = require("mongoose");

// Ruta para la vista en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts");
  } catch {
    res.status(500).json({
      error: "error interno del servidor, siga participando",
    });
  }
});

// Metodo GET - Obtener productos
router.get("/home", async (req, res) => {
  try {
    const arrayProducts = await products.leerArchivo();

    let limit = parseInt(req.query.limit);

    if (limit) {
      const arrayConLimite = arrayProducts.slice(0, limit);

      res.render("home", { products: arrayConLimite });
    } else {
      res.render("home", { products: arrayProducts });
    }
  } catch (error) {
    console.log("error error error", error);
    return res.status(500).send("error al cargar el archivo");
  }
});

router.get("/chat", (req, res) => {
  res.render("chat");
});

// Ruta para mostrar productos en card en products//
router.get("/products", async (req, res) => {
  try {
    // uso el metodo.lean() porque me estaba dando un error al leer los datos que paso a handelbars
    // por algo llamado prototipo. la verdad tuve que invetigar porque no me funcionaba y me lanzaba un error

    const productsArray = await productsModel.find().lean();
    // console.log(productsArray);
    res.render("products", { products: productsArray });
  } catch (error) {
    res.status(500).json({ message: "Error al cargar, error" });
  }
});

// metodo post que uso en products para agregar un producto nuevo
router.post("/products", async (req, res) => {
  try {
    const products = new productsModel(req.body);
    await products.save();
    res.send({ resultado: "success", products: products });
  } catch (error) {
    res.status(500).json({ message: "error al cargar, error" });
  }
});

// router.delete("/products/:id", async (req, res) => {
//   try {
//     const productId = mongoose.Types.ObjectId(req.params.id); // Convertir a ObjectId
//     await productsModel.findByIdAndDelete(productId);

//     res.json({ message: "Producto eliminado exitosamente" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al eliminar el producto" });
//   }
// });

module.exports = router;
