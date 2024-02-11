const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/mongoDb/controllsDB/product-manager-db");
const products = new ProductManager();
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

// / Vista para mostrar todos los productos con paginación
router.get("/products", async (req, res) => {
  try {
    const count = await ProductModel.countDocuments();
    res.render("products");
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
