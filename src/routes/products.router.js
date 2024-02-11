// const express = require("express");
// const router = express.Router();
// const ProductManager = require("../dao/mongoDb/controllsDB/product-manager-db");
// const products = new ProductManager();

// router.get("/", async (req, res) => {
//   try {
//     const limit = req.query.limit;
//     const product = await products.getProducts();
//     if (limit) {
//       res.json(product.slice(0, limit));
//     } else {
//       res.json(product);
//     }
//   } catch (error) {
//     console.error("Error al obtener productos", error);
//     res.status(500).json({
//       error: "Error interno del servidor",
//     });
//   }
// });

// // .................................................................
// //Metodo GET - Obtener un producto por ID
// router.get("/:pid", async (req, res) => {
//   try {
//     const id = req.params.pid;

//     const buscar = await products.getProductById(id);

//     if (buscar) {
//       res.json({ product: buscar });
//     } else {
//       res.status(404).json({ error: "Producto no encontrado" });
//     }
//   } catch (error) {
//     console.error("Error al obtener producto por ID:", error);
//     res.status(500).json({ error: "Error interno del servidor" });
//   }
// });

// //Agregar un Nuevo Producto
// router.post("/", async (req, res) => {
//   try {
//     const nuevoProducto = req.body;
//     await products.addProduct(nuevoProducto);
//     res.status(201).json({ message: "Producto agregado exitosamente" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al agregar el producto" });
//   }
// });
// // creamos metodo para actualizar producto

// router.put("/:pid", async (req, res) => {
//   const id = req.params.pid;
//   const productoActualizado = req.body;

//   try {
//     await products.updateProduct(id, productoActualizado);
//     res.json({ message: "Producto Actualizado Exitosamente" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al actualizar el producto" });
//   }
// });

// //Eliminar un producto por ID
// router.delete("/:pid", async (req, res) => {
//   const id = req.params.pid;
//   try {
//     await products.deletproduct(id);
//     res.json({ message: "Producto eliminado exitosamente" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al eliminar el producto" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/mongoDb/controllsDB/product-manager-db");
const products = new ProductManager();

// Método GET - Obtener productos con búsqueda, paginación y ordenamiento
router.get("/", async (req, res) => {
  try {
    // Parsear los parámetros de consulta
    const { limit = 10, page = 1, sort = "title", query = "" } = req.query;
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);

    // Obtener la lista de productos
    const productList = await products.getProducts();

    // Filtrar productos por consulta
    let filteredProducts = productList;
    if (query) {
      filteredProducts = productList.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Ordenar productos
    filteredProducts.sort((a, b) => {
      if (sort === "title") {
        return a.title.localeCompare(b.title);
      } else if (sort === "price") {
        return a.price - b.price;
      }
      return 0;
    });

    // Calcular detalles de paginación
    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / parsedLimit);
    const startIndex = (parsedPage - 1) * parsedLimit;
    const endIndex = Math.min(startIndex + parsedLimit, totalProducts);

    // Obtener la página de productos actual
    const pageOfProducts = filteredProducts.slice(startIndex, endIndex);

    // Construir respuesta
    const response = {
      products: pageOfProducts,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: parsedPage,
        hasNextPage: parsedPage < totalPages,
        hasPreviousPage: parsedPage > 1,
      },
    };

    // Devolver respuesta
    res.json(response);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Método GET - Obtener un producto por ID
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

// Método POST - Agregar un nuevo producto
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

// Método PUT - Actualizar producto por ID
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

// Método DELETE - Eliminar producto por ID
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
