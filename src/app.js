// empezamos importando
const express = require("express");
const productRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const socket = require("socket.io");
const ProductManager = require("./dao/fyleSistem/controlles/product-Manager.js");
const products = new ProductManager(
  "./src/dao/fyleSistem/models/products.json"
);
const multer = require("multer");
const MessageModel = require("./dao/mongoDb/modelsDB/message.model.js");
const exphbs = require("express-handlebars"); // motor de plantilla handlebars
const messages = []; // Aquí agrego la línea para inicializar 'messages', del chat box
const PUERTO = 8080; // creo  puerto
require("../src/database.js");

const app = express(); // creamos app

// configuro en moto de plantillas handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views"); // defino el directorio donde se encuentran las vistas

// creo midlewares
app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configuro multer
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
// app.use("/carts", cartsRouter);

// pongo a escuchar al segvidor
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchado http://localhost:${PUERTO}`);
});

const io = new socket.Server(httpServer);

// configuro los eventos de socket.io (conection)

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");
  // Envío la lista de productos cuando un cliente se conecta

  //Guardo el Msj en Mongo DB
  socket.on("message", async (data) => {
    await MessageModel.create(data);

    //Obtengo los msj Mongo DB y se los paso al cliente:
    const messages = await MessageModel.find();
    console.log(messages);

    io.sockets.emit("message", messages);
  });

  const productList = await products.getProducts();
  if (Array.isArray(productList) && productList.length > 0) {
    socket.emit("products", productList);
  } else {
    console.error("Invalid product data:", productList);
  }

  socket.emit("products", productList);

  // chat-Box
  socket.on("message", (data) => {
    messages.push(data);
    io.emit("message", messages);
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
