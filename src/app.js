// empezamos importando
const express = require("express");
const productRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const path = require("path");

// creamos puerto
const PUERTO = 8080;

// creamos app

const app = express();

// creamos ruta

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routing
app.use("/api/products", productRouter);
app.use("/api/cart", cartsRouter);
app.use("/static", express.static(path.join(__dirname, "..", "public")));




// ponemos a escuchar al segvidor
app.listen(PUERTO, () => {
  console.log(`Escuchado http://localhost:${PUERTO}`);
});
