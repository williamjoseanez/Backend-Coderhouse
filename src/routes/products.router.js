const express = require("express");
const router = express.Router();
const ProductManager = require("../controlles/product-Manager");
const products = new ProductManager("./src/models/products.json");

router.get("/", async (req, res) => {
  try {
    const arrayProductos = await products.leerArchivo();

    let limit = parseInt(req.query.limit);

    if (limit) {
      const arrayConLimite = arrayProductos.slice(0, limit);
      return res.send(arrayConLimite);
    } else {
      return res.send(arrayProductos);
    }
  } catch (error) {
    console.log("error error error", error);
    return res.status(500).send("error al cargar el archivo");
  }
});

// .................................................................

router.get("/:pid", async (req, res) => {
  try {
    let pid = parseInt(req.params.pid);

    const buscar = await products.getProductById(pid);

    if (buscar) {
      return res.send(buscar);
    } else {
      return res.send("ID de producto incorrecto, intente de nuevo");
    }
  } catch (error) {
    console.log(error);
    res.send("error al cargar");
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
  try {
    const productId = parseInt(req.params.pid);
    const productoActualizado = req.body;
    await products.updateProduct(productId, productoActualizado);

    res.json({ message: "Producto Actualizado Exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
});


  //Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    await products.deletproduct(productId);

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
});


module.exports = router;
