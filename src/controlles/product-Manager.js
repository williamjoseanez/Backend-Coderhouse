const { default: test } = require("node:test");

const fs = require("fs").promises;

class ProductManager {
  static ultId = 0;

  // creamos el constructor con array vacio
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(nuevoObjeto) {
    let { title, description, price, img, code, stock } = nuevoObjeto;
    // validamos cada campo
    if (!title || !description || !price || !img || !code || !stock) {
      console.log("Todos los campos son obligatorios");
      return;
    }
    // validamos codigo unico
    if (this.products.some((item) => item.code === code)) {
      console.log("El codigo debe ser unico, lo estas repitiendo");
      return;
    }

    // aqui creamos el nuevo objeto con todos los datos que me piden

    const newProduct = {
      pid: ++ProductManager.ultId,
      title,
      description,
      price,
      img,
      code,
      stock,
    };

    this.products.push(newProduct);
    await this.guardarArchivo(this.products);
  }
  getProducts() {
    console.log(this.products);
  }

  async getProductById(pid) {
    try {
      const arrayProductos = await this.leerArchivo();
      const productoBuscado = arrayProductos.find(
        (producto) => producto.pid === pid
      );

      if (!productoBuscado) {
        console.log("No se encontro el producto");
      } else {
        console.log("producto encontrado ");
        return productoBuscado;
      }
    } catch (error) {
      console.log("error al leer el archivo", error);
    }
  }

  // leemos un producto
  async leerArchivo() {
    try {
      const respuesta = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(respuesta);
      return arrayProductos;
    } catch (error) {
      console.log("error al leer un archivo", error);
    }
  }

  // guardamos un producto
  async guardarArchivo(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("error al guardar el archivo", error);
    }
  }

  // para actalizar productos
  async updateProduct(pid, productAtualizado) {
    try {
      const arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((p) => p.pid === pid);

      if (index !== -1) {
        arrayProductos.splice(index, 1, productAtualizado);
        await this.guardarArchivo(arrayProductos);
      } else {
        console.log("no se encontro el elemento a actualizar");
      }
    } catch (error) {
      console.log("error al actualizar el producto", error);
    }
  }

  async deletproduct(pid, productAtualizado) {
    try {
      const arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((p) => p.pid === pid);

      if (index !== -1) {
        arrayProductos.splice(index, 1);
        await this.guardarArchivo(arrayProductos);
      } else {
        console.log("no se encontro el elemento a borrar");
      }
    } catch (error) {
      console.log("error al borrar el producto", error);
    }
  }

  async deletAllProducts(pid, productAtualizado) {
    try {
      const arrayProductos = await this.leerArchivo();
      const index = arrayProductos.findIndex((p) => p.pid === pid);

      if (index !== -1) {
        arrayProductos.splice(index);
        await this.guardarArchivo(arrayProductos);
      } else {
        console.log("no se encontro el elemento a borrar");
      }
    } catch (error) {
      console.log("error al borrar el producto", error);
    }
  }

  async getProductsLimit(limit) {
    const arrayProductos = await this.leerArchivo();
    if (limit) {
      return arrayProductos.slice(0, limit);
    }
    return arrayProductos;
  }
}

module.exports = ProductManager;
