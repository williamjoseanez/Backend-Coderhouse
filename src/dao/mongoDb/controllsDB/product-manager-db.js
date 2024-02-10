const ProductsModel = require("../modelsDB/products.model");

class ProductManager {
  async addProduct({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      // validamos cada campo

      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son obligatorios");
        return;
      }
      // validamos codigo unico
      

      const existingProduct = await ProductsModel.findOne({ code: code });
      if (existingProduct) {
        console.log("El código debe ser único, ya está siendo utilizado");
        return;
      }

      // aqui creamos el nuevo objeto con todos los datos que me piden

      const newProduct = new ProductsModel({
        // id: this.getNextProductId(),
        title,
        description,
        price,
        img,
        code,
        stock,
        status: true,
        category,
        thumbnails: thumbnails || [],
      });

      await newProduct.save();
    } catch (error) {
      console.log("error al agregar el producto", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const products = await ProductsModel.find();
      return products;
    } catch (error) {
      console.log("Error al obtener la lista de productos", error);
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductsModel.findById(id);

      if (!product) {
        console.log(`No se ha encontrado el producto con ID "${id}"`);
        return null;
      }
      console.log("producto Encontrado");
      return product;
    } catch (error) {
      console.log("Error al buscar el producto por ID");
    }
  }
  async updateProduct(id, productActualizado) {
    try {
      const productUpdate = await ProductsModel.findByIdAndUpdate(
        id,
        productActualizado
      );

      if (!productUpdate) {
        console.log("El producto no existe");
        return null;
      }

      console.log("producto actializado con exito");
      return productUpdate;
    } catch (error) {
      console.log("error al actualizar el producto", error);
    }
  }
  async deletproduct(id) {
    try {
      const productDelete = await ProductsModel.findByIdAndDelete(id);

      if (!productDelete) {
        console.log("No se ha podido eliminar el producto");
        return null;
      }
      console.log("Se ha eliminado correctamente el producto");
      return null;
    } catch (error) {
      console.log("error al borrar el producto", error);
      throw error;
    }
  }
}

module.exports = ProductManager;
