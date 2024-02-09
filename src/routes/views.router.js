const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/fyleSistem/controlles/product-Manager");
const products = new ProductManager(
  "./src/dao/fyleSistem/models/products.json"
);
const ImagenModel = require("../dao/mongoDb/modelsDB/image.models");
const path = require("path");
const ProductModel = require("../dao/mongoDb/modelsDB/products.model");
const fs = require("fs").promises;

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
// chat
router.get("/chat", (req, res) => {
  res.render("chat");
});

// multer, fomulario de imagnes
router.get("/multer", (req, res) => {
  res.render("multer");
});

router.get("/upload", async (req, res) => {
  const imagenes = await ImagenModel.find();
  const newArrayImagenes = imagenes.map((imagen) => {
    return {
      id: imagen._id,
      title: imagen.title,
      description: imagen.description,
      filename: imagen.filename,
      path: imagen.path,
    };
  });

  res.render("upload", { imagenes: newArrayImagenes });
});

// POST - Agregar un nuevo producto
router.post("/upload", async (req, res) => {
  try {
    const imagen = new ImagenModel();
    imagen.title = req.body.title;
    imagen.description = req.body.description;
    imagen.filename = req.file.filename;
    imagen.path = "/uploads/" + req.file.filename; // Carpeta donde se guardan las imágenes

    // Guardar la imagen en la base de datos
    await imagen.save();

    // Redireccionar a home con mensaje de éxito
    res.redirect("upload");
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    res.status(500).send("Error al subir la imagen");
  }
});

// delet imagen rutinng

router.get("/image/:id/delete", async (req, res) => {
  const { id } = req.params;
  const imagen = await ImagenModel.findByIdAndDelete(id);
  await fs.unlink(path.resolve("./src/public" + imagen.path));
  res.redirect("/upload");
});

// // Ruta para mostrar productos en card en products//
// router.get("/products", async (req, res) => {
//   try {
//     // uso el metodo.lean() porque me estaba dando un error al leer los datos que paso a handelbars
//     // por algo llamado prototipo. la verdad tuve que invetigar porque no me funcionaba y me lanzaba un error

//     const productsArray = await productsModel.find().lean();
//     // console.log(productsArray);
//     res.render("products", { products: productsArray });
//   } catch (error) {
//     res.status(500).json({ message: "Error al cargar, error" });
//   }
// });

// Ruta para mostrar todos los productos con paginación
router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, category, minPrice, maxPrice } = req.query;

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    };

    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (minPrice && maxPrice) {
      filter.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }

    const [products, categories] = await Promise.all([
      ProductModel.find(filter, null, options).lean(),
      ProductModel.distinct("category"),
    ]);

    const totalProducts = await ProductModel.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / parseInt(limit));

    res.render("products", {
      products,
      categories,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error al cargar los productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// metodo post que uso en products para agregar un producto nuevo
router.post("/products", async (req, res) => {
  try {
    const newProduct = new ProductModel(req.body); // Creo un nuevo producto utilizando el modelo ProductModel
    await newProduct.save(); // Guardo el nuevo producto en la base de datos
    res.send({ resultado: "success", product: newProduct }); // Respondo con el nuevo producto creado
  } catch (error) {
    console.error("Error al agregar un nuevo producto:", error);
    res.status(500).json({ error: "Error al agregar un nuevo producto" }); // Respondo con un mensaje de error en caso de fallo
  }
});

module.exports = router;
