const express = require("express");
const router = express.Router();
const ProductManager = require("../controlles/product-Manager");
const products = new ProductManager("./src/models/products.json");

// Metodo GET - Obtener productos
router.get("/", async (req, res) => {
  try {
    const arrayProducts = await products.leerArchivo();

    let limit = parseInt(req.query.limit);

    if (limit) {
      const arrayConLimite = arrayProducts.slice(0, limit);

      res.render("index", { products: arrayConLimite });
    } else {
      res.render("index", { products: arrayProducts });
    }
  } catch (error) {
    console.log("error error error", error);
    return res.status(500).send("error al cargar el archivo");
  }
});

// Ruta para la vista en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts", { products });
  } catch {
    res.status(500).json({
      error: "error interno del servidor, siga participando",
    });
  }
});

module.exports = router;
