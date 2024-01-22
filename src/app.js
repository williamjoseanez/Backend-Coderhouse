// empezamos importando
const express = require("express");
const productRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const path = require("path");
const socket = require("socket.io");
const ProductManager = require("./controlles/product-Manager");
const products = new ProductManager("./src/models/products.json");
// motor de plantilla handlebars
const exphbs = require("express-handlebars");

// creamos puerto
const PUERTO = 8080;

// Aquí agregamos la línea para inicializar 'messages'
const messages = [];
// creamos app

const app = express();

// configuramos en moto de plantillas handlebars
app.engine("handlebars", exphbs.engine());

app.set("view engine", "handlebars");
// definimos el directorio donde se encuentran las vistas
app.set("views", "./src/views");

// creamos ruta
app.use(express.static("./src/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routing
app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartsRouter);

// ponemos a escuchar al segvidor
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchado http://localhost:${PUERTO}`);
});

const io = socket(httpServer);

// configuramos los eventos de socket.io (conection)

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");
  // Envía la lista de productos cuando un cliente se conecta

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
    //Con emit emitimos eventos desde el servidor al cliente.
  });

  //Recibimos el evento "eliminarProducto"
  socket.on("eliminarProducto", async (id) => {
    await products.deletproduct(id);
    io.sockets.emit("products", products.getProducts());
  });

  //Recibimos el evento "agregarProducto"
  socket.on("agregarProducto", async (product) => {
    await products.addProduct(product);
    io.sockets.emit("products", products.getProducts());
  });
});
