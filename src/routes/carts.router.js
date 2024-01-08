const express = require("express");
const router = express.Router();



const cart = [];

router.get("/", (requ, res) => {
  res.json(cart);
});

router.post("/", (req, res) => {
  const nuevoProduct = req.body;
  cart.push(nuevoProduct);
  res.send({ status: "success", msg: " Producto Agregado correctamente" });
});

module.exports = router;
