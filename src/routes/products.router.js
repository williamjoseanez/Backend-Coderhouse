const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/fyleSistem/controlles/product-Manager");
const products = new ProductManager(
  "./src/dao/fyleSistem/models/products.json"
);

// Metodo GET - Obtener productos con límite
// router.get("/", async (req, res) => {
//   try {
//     const arrayProductos = await products.leerArchivo();

//     let limit = parseInt(req.query.limit);

//     if (limit) {
//       const arrayConLimite = arrayProductos.slice(0, limit);
//       return res.send(arrayConLimite);
//     } else {
//       return res.send(arrayProductos);
//     }
//   } catch (error) {
//     console.log("error error error", error);
//     return res.status(500).send("error al cargar el archivo");
//   }
// });
// Metodo GET - Obtener productos con límite, paginación y ordenamiento
router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Obtengo todos los productos
    let arrayProductos = await products.leerArchivo();

    // Aplico filtros si existen
    if (query) {
      //filtro por categoría
      arrayProductos = arrayProductos.filter(
        (producto) => producto.categoria === query
      );
    }

    // Aplico el  ordenamiento si está presente
    if (sort) {
      arrayProductos.sort((a, b) => {
        if (sort === "asc") {
          return a.precio - b.precio;
        } else if (sort === "desc") {
          return b.precio - a.precio;
        } else {
          return 0;
        }
      });
    }

    // Calculo el índice inicial y final para la paginación
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Obtengo la página actual de productos
    const arrayConPaginacion = arrayProductos.slice(startIndex, endIndex);

    // Calculo el número total de páginas
    const totalPages = Math.ceil(arrayProductos.length / limit);

    // Creo objeto de respuesta con los productos paginados
    const response = {
      status: "success",
      payload: arrayConPaginacion,
      totalPages,
      prevPage: page > 1 ? parseInt(page) - 1 : null,
      nextPage: page < totalPages ? parseInt(page) + 1 : null,
      page: parseInt(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink:
        page > 1
          ? `/api/products?limit=${limit}&page=${
              parseInt(page) - 1
            }&sort=${sort}&query=${query}`
          : null,
      nextLink:
        page < totalPages
          ? `/api/products?limit=${limit}&page=${
              parseInt(page) + 1
            }&sort=${sort}&query=${query}`
          : null,
    };

    // Envio la respuesta
    res.json(response);
  } catch (error) {
    console.log("error error error", error);
    res.status(500).json({ error: "Error al cargar el archivo" });
  }
});

// .................................................................
//Metodo GET - Obtener un producto por ID
router.get("/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);

    const buscar = await products.getProductById(pid);

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
router.delete("/:pid", async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    await products.deletproduct(productId);

    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});

module.exports = router;
