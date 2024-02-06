const express = require("express");
const router = express.Router();
const CartManager = require("../dao/controlles/cart-Manager");
const cartManager = new CartManager("./src/dao/models/carts.json");

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.json(newCart);
  } catch (error) {
    console.error("Error al crear un nuevo carrito", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);

  try {
    const cart = await cartManager.getCartById(cartId);
    res.json(cart.products);
  } catch (error) {
    console.error("Error al querer obtener el Carrito", error);
    res.status(500).json({ error: "Error del Servidor" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const updateCart = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res.json(updateCart.products);
  } catch (error) {
    console.error(
      "Error al intentar agregar un producto al carrito de compras",
      error
    );
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
