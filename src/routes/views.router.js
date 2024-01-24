const express = require("express");
const router = express.Router();
const ProductManager = require("../controlles/product-Manager");
const products = new ProductManager("./src/models/products.json");
const productsModel = require("../models/products.model");

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

router.get("/products", async (req, res) => {
  try {
    const products = await productsModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "error al cargar, error" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const products = new productsModel(req.body);
    await products.save();
    res.send({ resultado: "success", products: products})
  } catch (error) {
    res.status(500).json({ message: "error al cargar, error" });
  }
})



module.exports = router;
