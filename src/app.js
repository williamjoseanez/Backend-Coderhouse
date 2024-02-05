// empezamos importando
const express = require("express");
const productRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const path = require("path");
const socket = require("socket.io");
const ProductManager = require("./controlles/product-Manager");
const products = new ProductManager("./src/models/products.json");
const mongoose = require("mongoose");
const multer = require("multer");

require("../src/database.js");

// motor de plantilla handlebars
const exphbs = require("express-handlebars");

// creo  puerto
const PUERTO = 8080;

// Aquí agrego la línea para inicializar 'messages', del chat box
const messages = [];

// creamos app

const app = express();

// configuro en moto de plantillas handlebars
app.engine("handlebars", exphbs.engine());

app.set("view engine", "handlebars");

// defino el directorio donde se encuentran las vistas
app.set("views", "./src/views");

// creo midlewares
app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configuramos multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

app.use(multer({ storage }).single("image"));

// routing desde routes handlebars
app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartsRouter);


// pongo a escuchar al segvidor
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchado http://localhost:${PUERTO}`);
});

const io = socket(httpServer);

// configuro los eventos de socket.io (conection)

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");
  // Envío la lista de productos cuando un cliente se conecta

  const productList = await products.getProducts();
  // console.log("Product List:", productList);
  if (Array.isArray(productList) && productList.length > 0) {
    socket.emit("products", productList);
  } else {
    console.error("Invalid product data:", productList);
  }

  socket.emit("products", productList);

  // chat-Box
  socket.on("message", (data) => {
    messages.push(data);
    io.emit("messagesLogs", messages);
    //Con emit emito eventos desde el servidor al cliente.
  });

  //Recibo el evento "eliminarProducto"
  socket.on("eliminarProducto", async (id) => {
    await products.deletproduct(id);
    io.sockets.emit("products", products.getProducts());
  });

  //Recibo el evento "agregarProducto"
  socket.on("agregarProducto", async (product) => {
    await products.addProduct(product);
    io.sockets.emit("products", products.getProducts());
  });
});
