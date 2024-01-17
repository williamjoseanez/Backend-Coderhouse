// const ProductManager = require("./controlles/product-Manager");
// const products = new ProductManager("./src/models/products.json");
// const express = require("express");

console.log("esta funcionando");

const socket = io();

socket.on("products", (data) => {
  renderProductos(data);
});

const renderProductos = (products) => {
  const contenedorProductos = document.getProductById("contenedorProductos");
  contenedorProductos.innerHTML = "";

  products.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    //Agregamos boton para eliminar:
    card.innerHTML = `
                <p>Id ${item.id} </p>
                <p>Titulo ${item.title} </p>
                <p>Precio ${item.price} </p>
                <button> Eliminar Producto </button>
        
        `;
    contenedorProductos.appendChild(card);

    card.querySelector("button").addEventListener("click", () => {
      deletproduct(item.id);
    });
  });
};

const deletproduct = (id) => {
  socket.emit("eliminarProducto", id);
};

document.getProductById("btnEnviar").addEventListener("click", () => {
  addProduct();
});

const addProduct = () => {
  const product = {
    title: document.getProductById("title").value,
    description: document.getProductById("description").value,
    price: document.getProductById("price").value,
    thumbnail: document.getProductById("thumbnail").value,
    code: document.getProductById("code").value,
    stock: document.getProductById("stock").value,
    category: document.getProductById("category").value,
    status: document.getProductById("status").value === "true",
  };

  socket.emit("addProduct", product);

  //   socket.emit("mensaje", "hola mundillo");

  socket.on("saludos", (data) => {
    console.log(data);
  });
};
