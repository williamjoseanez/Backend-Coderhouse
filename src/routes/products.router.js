const express = require("express");
const router = express.Router();
const ProductManager = require("../controlles/product-Manager");
const products = new ProductManager("./src/models/products.json");

router.get("/", async (req, res) => {
  try {
    const arrayProductos = await products.leerArchivo();

    let limit = parseInt(req.query.limit);

    if (limit) {
      const arrayConLimite = arrayProductos.slice(0, limit);
      return res.send(arrayConLimite);
    } else {
      return res.send(arrayProductos);
    }
  } catch (error) {
    console.log("error error error", error);
    return res.status(500).send("error al cargar el archivo");
  }
});

// .................................................................

router.get("/:pid", async (req, res) => {
  try {
    let pid = parseInt(req.params.pid);

    const buscar = await products.getProductById(pid);

    if (buscar) {
      return res.send(buscar);
    } else {
      return res.send("ID de producto incorrecto, intente de nuevo");
    }
  } catch (error) {
    console.log(error);
    res.send("error al cargar");
  }
});

// creamos metodo para actualizar producto

router.put("/:pid", (req, res) => {
  // logica de actualizacion del producto
  const { pid } = req.params;
  const { title, description, price, img, code, stock } = req.body;
  const productoActualizadoIndex = products.findIndex(
    (products) => products.pid === parseInt(pid)
  );

  if (productoActualizadoIndex !== -1) {
      products[productoActualizadoIndex]= {
    
    // products[productoActualizadoIndex].id = id;
    // products[productoActualizadoIndex].title = title;
    // products[productoActualizadoIndex].description = description;
    // products[productoActualizadoIndex].price = price;
    // products[productoActualizadoIndex].img = img;
    // products[productoActualizadoIndex].code = code;
    // products[productoActualizadoIndex].stock = stock;
    
    //metodo reduce es una forma mas elegante de hacerlo
    id: parseInt(pid),
      title,
      description,
      price,
      img,
      code,
      stock, }
  
    console.log(products);
    res.status(200).json({
      status: "succes",
      data: products[productoActualizadoIndex],
    });
  } else {
    res.status(404).json({
      msg: "El producto no que intenta actualizar no existe",
    });
  }
});
// eliminar un producto por su ID
router.delete("/:pid", (req, res) => {
  const index = products.indexOf(
    products.filter((e) => e.pid == req.params.pid)[0]
  );
  if (index > -1) {
    products.splice(index, 1);

    console.log(products);
    res.json({ status: "success", msg: "Producto Eliminado correctamente" });
  } else {
    res.status(404).json({
      msg: "Error al intentar eliminar el producto",
    });
    console.log(products);
  }
});

module.exports = router;
