const { Long } = require("mongodb");
const CartModel = require("../modelsDB/cart.models");

class CartManager {
  async crearCarrito() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log("Error al crear el nuevo carrinho de compriñas");
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      if (!cart) {
        console.log("No existe ese carrito con el id");
        return null;
      }

      return cart;
    } catch (error) {
      console.log("Error al traer el carrito, fijate bien lo que haces", error);
    }
  }

  async aggProductCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const existProduct = cart.products.find(
        (item) => item.product.toString() === productId
      );

      if (existProduct) {
        existProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      //Vamos a marcar la propiedad "products" como modificada antes de guardar:
      cart.markModified("products");

      await cart.save();
      return cart;
    } catch (error) {
      console.log("error al agregar un producto", error);
    }
  }

  // remueve un producto del carrito
  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.getCartById(cartId);
      const updatedProducts = cart.products.filter(
        (item) => item.product.toString() !== productId
      );
      cart.products = updatedProducts;

      // Marcar la propiedad "products" como modificada antes de guardar
      cart.markModified("products");

      await cart.save();
      return cart;
    } catch (error) {
      console.error(
        "Error al intentar eliminar un producto del carrito",
        error
      );
      throw error;
    }
  }

  // funcion para vaciar el carrito
  async updateCart(cartId, updatedProducts) {
    try {
      const cart = await this.getCartById(cartId);
      cart.products = updatedProducts;

      // Marcar la propiedad "products" como modificada antes de guardar
      cart.markModified("products");

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al intentar actualizar el carrito", error);
      throw error;
    }
  }
  async updateProductQuantity(cartId, productId, quantity) {
    try {
      const cart = await this.getCartById(cartId);
      const productToUpdate = cart.products.find(
        (item) => item.product.toString() === productId
      );

      if (productToUpdate) {
        productToUpdate.quantity = quantity;
        cart.markModified("products");
        await cart.save();
        return cart;
      } else {
        console.error("No se encontró el producto en el carrito");
        return null;
      }
    } catch (error) {
      console.error(
        "Error al actualizar la cantidad de un producto en el carrito",
        error
      );
      throw error;
    }
  }

  async clearCart(cartId) {
    try {
      const cart = await this.getCartById(cartId);
      cart.products = [];
      await cart.save();
    } catch (error) {
      console.error("Error al limpiar el carrito", error);
      throw error;
    }
  }
}

module.exports = CartManager;
