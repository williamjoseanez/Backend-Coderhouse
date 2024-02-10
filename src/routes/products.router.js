const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/mongoDb/controllsDB/product-manager-db");
const products = new ProductManager();

// Metodo GET - Obtener productos con límite
// router.get("/", async (req, res) => {
//   try {
//     const limit = req.query.limit;
//     const productos = await products.getProducts();
//     let productosRenderizados = productos;
//     if (limit) {
//       productosRenderizados = productos.slice(0, limit);
//     }
//     res.json("products", { productos: productosRenderizados });
//   } catch (error) {
//     console.error("Error al obtener productos", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// });
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const product = await products.getProducts();
    if (limit) {
      res.json(product.slice(0, limit));
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error("Error al obtener productos", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

// .................................................................
//Metodo GET - Obtener un producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;

    const buscar = await products.getProductById(id);

    if (buscar) {
      res.json({ product: buscar });
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//Agregar un Nuevo Producto
router.post("/", async (req, res) => {
  try {
    const nuevoProducto = req.body;
    await products.addProduct(nuevoProducto);
    res.status(201).json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al agregar el producto" });
  }
});
// creamos metodo para actualizar producto

router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const productoActualizado = req.body;

  try {
    await products.updateProduct(id, productoActualizado);
    res.json({ message: "Producto Actualizado Exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});

//Eliminar un producto por ID
router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;
  try {
    await products.deletproduct(id);
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});

module.exports = router;
