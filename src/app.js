// empezamos importando
const express = require("express");
const productRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");
const path = require("path");
const socket = require("socket.io");

// motor de plantilla handlebars
const exphbs = require("express-handlebars");
const { Socket } = require("socket.io");

// creamos puerto
const PUERTO = 8080;

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
app.use("/realtimeproducts", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartsRouter);
app.use("/", express.static(path.join(__dirname, "..", "public")));

// ponemos a escuchar al segvidor
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchado http://localhost:${PUERTO}`);
});

const io = socket(httpServer);

// configuramos los eventos de socket.io (conection)

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("mensaje", (data) => {
    console.log(data);
    io.sockets.emit("mensaje", data);
  });

  socket.emit("saludos", "mensaje para el cliente");
});
